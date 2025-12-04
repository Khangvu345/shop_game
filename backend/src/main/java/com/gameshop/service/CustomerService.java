package com.gameshop.service;

import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.dto.request.ChangePasswordRequest;
import com.gameshop.model.dto.request.SaveAddressRequest;
import com.gameshop.model.dto.request.UpdateCustomerProfileRequest;
import com.gameshop.model.dto.response.AddressResponse;
import com.gameshop.model.dto.response.CustomerListResponse;
import com.gameshop.model.dto.response.CustomerProfileResponse;

/**
 * Service interface cho customer profile và address management
 */
public interface CustomerService {

    // Customer endpoints
    /**
     * Lấy thông tin profile của customer
     * 
     * @param partyId ID của customer (party_id)
     * @return Customer profile với statistics
     */
    CustomerProfileResponse getProfile(Long partyId);

    /**
     * Cập nhật profile của customer
     * 
     * @param partyId ID của customer
     * @param request Thông tin cập nhật
     * @return Profile đã cập nhật
     */
    CustomerProfileResponse updateProfile(Long partyId, UpdateCustomerProfileRequest request);

    /**
     * Đổi mật khẩu
     * 
     * @param partyId ID của customer
     * @param request Request chứa mật khẩu cũ và mới
     */
    void changePassword(Long partyId, ChangePasswordRequest request);

    /**
     * Lấy địa chỉ mặc định
     * 
     * @param partyId ID của customer
     * @return Địa chỉ mặc định hoặc null nếu chưa có
     */
    AddressResponse getDefaultAddress(Long partyId);

    /**
     * Lưu hoặc cập nhật địa chỉ mặc định
     * 
     * @param partyId ID của customer
     * @param request Thông tin địa chỉ
     * @return Địa chỉ đã lưu
     */
    AddressResponse saveDefaultAddress(Long partyId, SaveAddressRequest request);

    // Admin endpoints
    /**
     * Lấy danh sách tất cả customers (Admin)
     * 
     * @param page    Số trang (0-indexed)
     * @param size    Kích thước trang
     * @param sortBy  Trường để sắp xếp
     * @param sortDir Hướng sắp xếp (ASC/DESC)
     * @return Danh sách customers với statistics
     */
    PageResponse<CustomerListResponse> getAllCustomers(int page, int size, String sortBy, String sortDir);

    /**
     * Lấy chi tiết customer theo ID (Admin)
     * 
     * @param id Customer ID
     * @return Customer profile
     */
    CustomerProfileResponse getCustomerById(Long id);

    /**
     * Tìm kiếm customers theo keyword (Admin)
     * 
     * @param keyword Từ khóa tìm kiếm (fullName, email, phone)
     * @param page    Số trang (0-indexed)
     * @param size    Kích thước trang
     * @param sortBy  Trường để sắp xếp
     * @param sortDir Hướng sắp xếp (ASC/DESC)
     * @return Danh sách customers tìm được
     */
    PageResponse<CustomerListResponse> searchCustomers(String keyword, int page, int size, String sortBy,
            String sortDir);
}
