package com.gameshop.service;

import com.gameshop.model.dto.request.CreateCategoryRequest;
import com.gameshop.model.dto.request.UpdateCategoryRequest;
import com.gameshop.model.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CreateCategoryRequest request);

    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);

    void deleteCategory(Long id);
}