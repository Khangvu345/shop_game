package com.gameshop.service.impl;

import com.gameshop.exception.BadRequestException;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.request.ChangePasswordRequest;
import com.gameshop.model.dto.request.SaveAddressRequest;
import com.gameshop.model.dto.request.UpdateCustomerProfileRequest;
import com.gameshop.model.dto.response.AddressResponse;
import com.gameshop.model.dto.response.CustomerListResponse;
import com.gameshop.model.dto.response.CustomerProfileResponse;
import com.gameshop.model.entity.Account;
import com.gameshop.model.entity.Address;
import com.gameshop.model.entity.Customer;
import com.gameshop.repository.AccountRepository;
import com.gameshop.repository.AddressRepository;
import com.gameshop.repository.CustomerRepository;
import com.gameshop.repository.OrderRepository;
import com.gameshop.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Service Implementation cho customer profile và address management
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final AccountRepository accountRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public CustomerProfileResponse getProfile(Long partyId) {
        Customer customer = customerRepository.findById(partyId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + partyId));

        return buildCustomerProfileResponse(customer);
    }

    @Override
    public CustomerProfileResponse updateProfile(Long partyId, UpdateCustomerProfileRequest request) {
        Customer customer = customerRepository.findById(partyId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + partyId));

        // Cập nhật chỉ những trường được phép
        customer.setFullName(request.fullName());
        customer.setPhoneNumber(request.phone());
        customer.setBirthDate(request.birthDate());

        // Email là read-only, không cập nhật

        Customer updated = customerRepository.save(customer);
        return buildCustomerProfileResponse(updated);
    }

    @Override
    public void changePassword(Long partyId, ChangePasswordRequest request) {
        // Validate newPassword và confirmPassword match
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        // Tìm account theo partyId
        Account account = accountRepository.findByPartyId(partyId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found for party ID: " + partyId));

        // Validate oldPassword
        // LƯU Ý: Hiện tại dùng NoOpPasswordEncoder nên so sánh trực tiếp
        // Khi chuyển sang BCrypt thì dùng passwordEncoder.matches()
        if (passwordEncoder.getClass().getSimpleName().equals("NoOpPasswordEncoder")) {
            // Plain text comparison
            if (!account.getPassword().equals(request.oldPassword())) {
                throw new BadRequestException("Old password is incorrect");
            }
        } else {
            // BCrypt comparison
            if (!passwordEncoder.matches(request.oldPassword(), account.getPassword())) {
                throw new BadRequestException("Old password is incorrect");
            }
        }

        // Update password (hash nếu dùng BCrypt)
        String newPassword = passwordEncoder.encode(request.newPassword());
        account.setPassword(newPassword);
        accountRepository.save(account);
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getDefaultAddress(Long partyId) {
        return addressRepository.findByPartyIdAndIsDefaultTrue(partyId)
                .map(this::mapToAddressResponse)
                .orElse(null);
    }

    @Override
    public AddressResponse saveDefaultAddress(Long partyId, SaveAddressRequest request) {
        // Kiểm tra nếu đã có default address
        Address address = addressRepository.findByPartyIdAndIsDefaultTrue(partyId)
                .orElse(null);

        if (address != null) {
            // UPDATE existing address
            address.setLine1(request.line1());
            address.setLine2(request.line2());
            address.setWard(request.ward());
            address.setCity(request.city());
            address.setPostalCode(request.postalCode());
        } else {
            // INSERT new address
            address = new Address();
            address.setPartyId(partyId);
            address.setLine1(request.line1());
            address.setLine2(request.line2());
            address.setWard(request.ward());
            address.setCity(request.city());
            address.setPostalCode(request.postalCode());
            address.setIsDefault(true);
        }

        Address saved = addressRepository.save(address);
        return mapToAddressResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerListResponse> getAllCustomers(Pageable pageable) {
        Page<Customer> customers = customerRepository.findAll(pageable);
        return customers.map(this::buildCustomerListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerProfileResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        return buildCustomerProfileResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerListResponse> searchCustomers(String keyword, Pageable pageable) {
        Page<Customer> customers = customerRepository.searchCustomers(keyword, pageable);
        return customers.map(this::buildCustomerListResponse);
    }

    // ===== Private Helper Methods =====

    private CustomerProfileResponse buildCustomerProfileResponse(Customer customer) {
        Long totalOrders = orderRepository.countByCustomerId(customer.getId());
        BigDecimal totalSpent = orderRepository.getTotalSpentByCustomerId(customer.getId());

        return new CustomerProfileResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getBirthDate(),
                customer.getTier(),
                customer.getPoints(),
                totalOrders,
                totalSpent != null ? totalSpent : BigDecimal.ZERO);
    }

    private CustomerListResponse buildCustomerListResponse(Customer customer) {
        Long totalOrders = orderRepository.countByCustomerId(customer.getId());
        BigDecimal totalSpent = orderRepository.getTotalSpentByCustomerId(customer.getId());

        return new CustomerListResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getTier(),
                customer.getPoints(),
                totalOrders,
                totalSpent != null ? totalSpent : BigDecimal.ZERO,
                customer.getCreatedAt());
    }

    private AddressResponse mapToAddressResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLine1(),
                address.getLine2(),
                address.getWard(),
                address.getCity(),
                address.getPostalCode(),
                address.getIsDefault());
    }
}
