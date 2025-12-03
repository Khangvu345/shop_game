package com.gameshop.service;

import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.dto.request.CreateCategoryRequest;
import com.gameshop.model.dto.request.UpdateCategoryRequest;
import com.gameshop.model.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    PageResponse<CategoryResponse> getAllCategories(int page, int size);

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CreateCategoryRequest request);

    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);

    void deleteCategory(Long id);

    List<Long> getAllCategoryIdsIncludingChildren(Long categoryId);
}