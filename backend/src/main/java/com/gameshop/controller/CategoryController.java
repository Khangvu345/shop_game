package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.request.CreateCategoryRequest;
import com.gameshop.model.dto.request.UpdateCategoryRequest;
import com.gameshop.model.dto.response.CategoryResponse;
import com.gameshop.service.CategoryService;
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
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "APIs quản lý danh mục sản phẩm")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả danh mục", description = "Trả về danh sách tất cả danh mục sản phẩm")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách danh mục thành công", categories)
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết danh mục", description = "Lấy thông tin chi tiết của một danh mục theo ID")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
            @Parameter(description = "ID của danh mục")
            @PathVariable Long id
    ) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy thông tin danh mục thành công", category)
        );
    }

    @PostMapping
    @Operation(summary = "Tạo danh mục mới", description = "Tạo một danh mục mới (Admin only - chưa chặn quyền)")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        CategoryResponse category = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Tạo danh mục thành công", category)
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật danh mục", description = "Cập nhật thông tin danh mục (Admin only - chưa chặn quyền)")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @Parameter(description = "ID của danh mục")
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        CategoryResponse category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Cập nhật danh mục thành công", category)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa danh mục", description = "Xóa một danh mục (Admin only - chưa chặn quyền)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @Parameter(description = "ID của danh mục")
            @PathVariable Long id
    ) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(
                ApiResponse.success("Xóa danh mục thành công")
        );
    }
}