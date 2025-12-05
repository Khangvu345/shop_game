package com.gameshop.controller;

import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.dto.request.ChangePasswordRequest;
import com.gameshop.model.dto.request.SaveAddressRequest;
import com.gameshop.model.dto.request.UpdateCustomerProfileRequest;
import com.gameshop.model.dto.response.AddressResponse;
import com.gameshop.model.dto.response.CustomerListResponse;
import com.gameshop.model.dto.response.CustomerProfileResponse;
import com.gameshop.model.entity.Account;
import com.gameshop.repository.AccountRepository;
import com.gameshop.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller cho customer profile và address management
 */
@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "APIs for customer profile and address management")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerService customerService;
    private final AccountRepository accountRepository;

    // ===== CUSTOMER ENDPOINTS =====

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get customer profile", description = "Get profile information for the logged-in customer")
    public ResponseEntity<CustomerProfileResponse> getProfile() {
        Long partyId = getCurrentPartyId();
        CustomerProfileResponse profile = customerService.getProfile(partyId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Update customer profile", description = "Update profile information (fullName, phone, birthDate). Email is read-only.")
    public ResponseEntity<CustomerProfileResponse> updateProfile(
            @Valid @RequestBody UpdateCustomerProfileRequest request) {
        Long partyId = getCurrentPartyId();
        CustomerProfileResponse updated = customerService.updateProfile(partyId, request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Change password", description = "Change customer password. Requires old password verification.")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        Long partyId = getCurrentPartyId();
        customerService.changePassword(partyId, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @GetMapping("/address")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get default address", description = "Get the default shipping address for checkout")
    public ResponseEntity<AddressResponse> getDefaultAddress() {
        Long partyId = getCurrentPartyId();
        AddressResponse address = customerService.getDefaultAddress(partyId);

        if (address == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(address);
    }

    @PutMapping("/address")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Save default address", description = "Save or update the default shipping address")
    public ResponseEntity<AddressResponse> saveDefaultAddress(
            @Valid @RequestBody SaveAddressRequest request) {
        Long partyId = getCurrentPartyId();
        AddressResponse address = customerService.saveDefaultAddress(partyId, request);
        return ResponseEntity.ok(address);
    }

    // ===== ADMIN ENDPOINTS =====

    @GetMapping("/admin/list")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all customers (Admin)", description = "Get paginated list of all customers with statistics")
    public ResponseEntity<PageResponse<CustomerListResponse>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        PageResponse<CustomerListResponse> customers = customerService.getAllCustomers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get customer by ID (Admin)", description = "Get detailed customer information by ID")
    public ResponseEntity<CustomerProfileResponse> getCustomerById(@PathVariable Long id) {
        CustomerProfileResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search customers (Admin)", description = "Search customers by name, email, or phone number")
    public ResponseEntity<PageResponse<CustomerListResponse>> searchCustomers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        PageResponse<CustomerListResponse> customers = customerService.searchCustomers(keyword, page, size, sortBy,
                sortDir);
        return ResponseEntity.ok(customers);
    }

    // ===== HELPER METHODS =====

    /**
     * Lấy partyId từ SecurityContext
     * Token format: accountId:role:timestamp
     * Username trong SecurityContext = accountId
     */
    private Long getCurrentPartyId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        try {
            // Parse accountId from username
            Long accountId = Long.parseLong(username);

            // Query Account to get partyId
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));

            return account.getParty().getId();

        } catch (NumberFormatException e) {
            throw new RuntimeException("Cannot parse accountId from username: " + username);
        }
    }
}
