package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.request.CreateSupplierRequest;
import com.gameshop.model.dto.request.UpdateSupplierRequest;
import com.gameshop.model.dto.response.SupplierResponse;
import com.gameshop.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/suppliers")
@RequiredArgsConstructor
@Tag(name = "Supplier Management", description = "APIs quản lý nhà cung cấp (Admin)")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    @Operation(summary = "Lấy danh sách nhà cung cấp",
               description = "Lấy danh sách tất cả nhà cung cấp")
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> getAllSuppliers() {
        List<SupplierResponse> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách nhà cung cấp thành công", suppliers)
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết nhà cung cấp",
               description = "Lấy thông tin chi tiết của một nhà cung cấp theo ID")
    public ResponseEntity<ApiResponse<SupplierResponse>> getSupplierById(
            @Parameter(description = "ID của nhà cung cấp")
            @PathVariable Long id
    ) {
        SupplierResponse supplier = supplierService.getSupplierById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy thông tin nhà cung cấp thành công", supplier)
        );
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm nhà cung cấp theo tên",
               description = "Tìm kiếm nhà cung cấp theo từ khóa trong tên (không phân biệt hoa thường)")
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> searchSuppliersByName(
            @Parameter(description = "Từ khóa tìm kiếm trong tên nhà cung cấp")
            @RequestParam String name
    ) {
        List<SupplierResponse> suppliers = supplierService.searchSuppliersByName(name);
        return ResponseEntity.ok(
                ApiResponse.success("Tìm kiếm nhà cung cấp thành công", suppliers)
        );
    }

    @PostMapping
    @Operation(summary = "Tạo nhà cung cấp mới",
               description = "Tạo một nhà cung cấp mới")
    public ResponseEntity<ApiResponse<SupplierResponse>> createSupplier(
            @Valid @RequestBody CreateSupplierRequest request
    ) {
        SupplierResponse supplier = supplierService.createSupplier(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Tạo nhà cung cấp thành công", supplier)
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật nhà cung cấp",
               description = "Cập nhật thông tin nhà cung cấp")
    public ResponseEntity<ApiResponse<SupplierResponse>> updateSupplier(
            @Parameter(description = "ID của nhà cung cấp")
            @PathVariable Long id,
            @Valid @RequestBody UpdateSupplierRequest request
    ) {
        SupplierResponse supplier = supplierService.updateSupplier(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Cập nhật nhà cung cấp thành công", supplier)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa nhà cung cấp",
               description = "Xóa một nhà cung cấp")
    public ResponseEntity<ApiResponse<Void>> deleteSupplier(
            @Parameter(description = "ID của nhà cung cấp")
            @PathVariable Long id
    ) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok(
                ApiResponse.success("Xóa nhà cung cấp thành công")
        );
    }
}