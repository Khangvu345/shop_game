package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.common.PageResponse;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.gameshop.service.CloudinaryService;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "APIs quản lý sản phẩm")
public class ProductController {

        private final ProductService productService;
        private final CloudinaryService cloudinaryService;

        @GetMapping
        @Operation(summary = "Lấy danh sách sản phẩm", description = "Lấy danh sách tất cả sản phẩm với bộ lọc đa điều kiện: tìm kiếm theo tên, lọc theo danh mục, lọc theo khoảng giá")
        public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
                        @Parameter(description = "Từ khóa tìm kiếm trong tên sản phẩm") @RequestParam(required = false) String keyword,
                        @Parameter(description = "ID danh mục để lọc sản phẩm (bao gồm cả danh mục con)") @RequestParam(required = false) Long categoryId,
                        @Parameter(description = "Giá tối thiểu (VND)") @RequestParam(required = false) BigDecimal minPrice,
                        @Parameter(description = "Giá tối đa (VND)") @RequestParam(required = false) BigDecimal maxPrice,
                        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Số lượng sản phẩm mỗi trang") @RequestParam(defaultValue = "10") int size) {
                PageResponse<ProductResponse> products = productService.getAllProducts(keyword, categoryId, minPrice,
                                maxPrice, page, size);
                return ResponseEntity.ok(
                                ApiResponse.success("Lấy danh sách sản phẩm thành công", products));
        }

        @GetMapping("/{id}")
        @Operation(summary = "Lấy thông tin chi tiết sản phẩm", description = "Lấy thông tin chi tiết của một sản phẩm theo ID")
        public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
                        @Parameter(description = "ID của sản phẩm") @PathVariable Long id) {
                ProductResponse product = productService.getProductById(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Lấy thông tin sản phẩm thành công", product));
        }

        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @Operation(summary = "Tạo sản phẩm mới", description = "Tạo một sản phẩm mới kèm ảnh (Admin only). " +
                        "Lưu ý: Trên Swagger UI có thể gặp lỗi, khuyến nghị dùng Postman hoặc cURL để test.")
        public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
                        @Parameter(description = "Thông tin sản phẩm (JSON)", required = true) @RequestPart("data") @Valid CreateProductRequest request,
                        @Parameter(description = "File ảnh sản phẩm (JPG, PNG, WEBP, tối đa 5MB)") @RequestPart(value = "image", required = false) MultipartFile file) {
                String imageUrl = null;

                try {
                        if (file != null && !file.isEmpty()) {
                                imageUrl = cloudinaryService.uploadImage(file);
                        }

                        ProductResponse product = productService.createProduct(request, imageUrl);

                        return ResponseEntity.status(HttpStatus.CREATED).body(
                                        ApiResponse.success("Tạo sản phẩm thành công", product));

                } catch (IllegalArgumentException e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ApiResponse.error("Lỗi validation: " + e.getMessage()));

                } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(ApiResponse.error("Lỗi upload ảnh: " + e.getMessage()));

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
                }
        }

        @PutMapping("/{id}")
        @Operation(summary = "Cập nhật sản phẩm (JSON)", description = "Cập nhật thông tin sản phẩm không bao gồm ảnh (Admin only)")
        public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
                        @Parameter(description = "ID của sản phẩm") @PathVariable Long id,
                        @Valid @RequestBody UpdateProductRequest request) {
                ProductResponse product = productService.updateProduct(id, request);
                return ResponseEntity.ok(
                                ApiResponse.success("Cập nhật sản phẩm thành công", product));
        }

        @PutMapping(value = "/{id}/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @Operation(summary = "Cập nhật sản phẩm kèm ảnh", description = "Cập nhật thông tin sản phẩm và ảnh (Admin only). "
                        +
                        "Lưu ý: Trên Swagger UI có thể gặp lỗi, khuyến nghị dùng Postman hoặc cURL để test.")
        public ResponseEntity<ApiResponse<ProductResponse>> updateProductWithImage(
                        @Parameter(description = "ID của sản phẩm") @PathVariable Long id,
                        @Parameter(description = "Thông tin sản phẩm (JSON)", required = true) @RequestPart("data") @Valid UpdateProductRequest request,
                        @Parameter(description = "File ảnh sản phẩm mới (JPG, PNG, WEBP, tối đa 5MB)") @RequestPart(value = "image", required = false) MultipartFile file) {
                String imageUrl = null;

                try {
                        if (file != null && !file.isEmpty()) {
                                imageUrl = cloudinaryService.uploadImage(file);
                        }

                        ProductResponse product = productService.updateProduct(id, request, imageUrl);

                        return ResponseEntity.ok(
                                        ApiResponse.success("Cập nhật sản phẩm thành công", product));

                } catch (IllegalArgumentException e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ApiResponse.error("Lỗi validation: " + e.getMessage()));

                } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(ApiResponse.error("Lỗi upload ảnh: " + e.getMessage()));

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
                }
        }

        @GetMapping("/check-sku")
        @Operation(summary = "Kiểm tra SKU đã tồn tại", description = "Kiểm tra xem SKU có bị trùng lặp hay không (Admin only). "
                        +
                        "Tham số excludeProductId dùng khi edit sản phẩm để bỏ qua chính sản phẩm đang edit.")
        public ResponseEntity<Map<String, Object>> checkSkuExists(
                        @Parameter(description = "SKU cần kiểm tra") @RequestParam String sku,
                        @Parameter(description = "ID sản phẩm đang edit (nếu có)") @RequestParam(required = false) Long excludeProductId) {

                boolean exists = productService.checkSkuExists(sku, excludeProductId);

                Map<String, Object> response = new java.util.HashMap<>();
                response.put("exists", exists);
                response.put("message", exists ? "SKU đã tồn tại" : "SKU khả dụng");

                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{id}")
        @Operation(summary = "Xóa sản phẩm", description = "Xóa một sản phẩm (Admin only)")
        public ResponseEntity<ApiResponse<Void>> deleteProduct(
                        @Parameter(description = "ID của sản phẩm") @PathVariable Long id) {
                productService.deleteProduct(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Xóa sản phẩm thành công"));
        }
}