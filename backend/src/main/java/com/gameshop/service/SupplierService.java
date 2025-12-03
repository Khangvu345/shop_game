package com.gameshop.service;

import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.dto.request.CreateSupplierRequest;
import com.gameshop.model.dto.request.UpdateSupplierRequest;
import com.gameshop.model.dto.response.SupplierResponse;

import java.util.List;

/**
 * Service interface cho Supplier - Nhà cung cấp
 */
public interface SupplierService {

    /**
     * Tạo nhà cung cấp mới
     */
    SupplierResponse createSupplier(CreateSupplierRequest request);

    /**
     * Lấy thông tin nhà cung cấp theo ID
     */
    SupplierResponse getSupplierById(Long id);

    /**
     * Lấy tất cả nhà cung cấp (có phân trang)
     */
    PageResponse<SupplierResponse> getAllSuppliers(int page, int size);

    /**
     * Tìm nhà cung cấp theo tên
     */
    List<SupplierResponse> searchSuppliersByName(String name);

    /**
     * Cập nhật thông tin nhà cung cấp
     */
    SupplierResponse updateSupplier(Long id, UpdateSupplierRequest request);

    /**
     * Xóa nhà cung cấp
     */
    void deleteSupplier(Long id);
}