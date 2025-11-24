package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.request.CreateProductRequest;
import com.gameshop.model.dto.request.UpdateProductRequest;
import com.gameshop.model.dto.response.ProductResponse;
import com.gameshop.service.ProductService;
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
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "APIs quản lý sản phẩm")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Lấy danh sách sản phẩm", description = "Lấy danh sách tất cả sản phẩm, có hỗ trợ tìm kiếm theo tên và lọc theo danh mục")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts(
            @Parameter(description = "Từ khóa tìm kiếm trong tên sản phẩm")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "ID danh mục để lọc sản phẩm")
            @RequestParam(required = false) Long categoryId
    ) {
        List<ProductResponse> products = productService.getAllProducts(keyword, categoryId);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách sản phẩm thành công", products)
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết sản phẩm", description = "Lấy thông tin chi tiết của một sản phẩm theo ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @Parameter(description = "ID của sản phẩm")
            @PathVariable Long id
    ) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy thông tin sản phẩm thành công", product)
        );
    }

    @PostMapping
    @Operation(summary = "Tạo sản phẩm mới", description = "Tạo một sản phẩm mới (Admin only - chưa chặn quyền)")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody CreateProductRequest request
    ) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Tạo sản phẩm thành công", product)
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật sản phẩm", description = "Cập nhật thông tin sản phẩm (Admin only - chưa chặn quyền)")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @Parameter(description = "ID của sản phẩm")
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Cập nhật sản phẩm thành công", product)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa sản phẩm", description = "Xóa một sản phẩm (Admin only - chưa chặn quyền)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @Parameter(description = "ID của sản phẩm")
            @PathVariable Long id
    ) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(
                ApiResponse.success("Xóa sản phẩm thành công")
        );
    }
}