package com.gameshop.service.impl;

import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.dto.request.CreateCategoryRequest;
import com.gameshop.model.dto.request.UpdateCategoryRequest;
import com.gameshop.model.dto.response.CategoryResponse;
import com.gameshop.model.entity.Category;
import com.gameshop.repository.CategoryRepository;
import com.gameshop.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public PageResponse<CategoryResponse> getAllCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categoryPage = categoryRepository.findAll(pageable);

        List<CategoryResponse> content = categoryPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                categoryPage.getTotalPages(),
                categoryPage.getTotalElements(),
                categoryPage.getNumber(),
                categoryPage.getSize());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        log.info("Tạo danh mục mới: {}", request.getCategoryName());

        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy danh mục cha với ID: " + request.getParentId()));
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);
        log.info("Đã tạo danh mục với ID: {}", savedCategory.getCategoryId());

        return mapToResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        log.info("Cập nhật danh mục ID: {}", id);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        if (request.getCategoryName() != null) {
            category.setCategoryName(request.getCategoryName());
        }
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy danh mục cha với ID: " + request.getParentId()));
            category.setParent(parent);
        }

        Category updatedCategory = categoryRepository.save(category);
        log.info("Đã cập nhật danh mục ID: {}", id);

        return mapToResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        log.info("Xóa danh mục ID: {}", id);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        categoryRepository.delete(category);
        log.info("Đã xóa danh mục ID: {}", id);
    }

    @Override
    public List<Long> getAllCategoryIdsIncludingChildren(Long categoryId) {
        List<Long> categoryIds = new ArrayList<>();
        categoryIds.add(categoryId);
        collectChildCategoryIds(categoryId, categoryIds);
        return categoryIds;
    }

    private void collectChildCategoryIds(Long parentId, List<Long> categoryIds) {
        List<Category> children = categoryRepository.findByParent_CategoryId(parentId);
        for (Category child : children) {
            categoryIds.add(child.getCategoryId());
            collectChildCategoryIds(child.getCategoryId(), categoryIds);
        }
    }

    private CategoryResponse mapToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setCategoryId(category.getCategoryId());
        response.setCategoryName(category.getCategoryName());
        response.setDescription(category.getDescription());

        if (category.getParent() != null) {
            response.setParentId(category.getParent().getCategoryId());
            response.setParentName(category.getParent().getCategoryName());
        }

        return response;
    }
}
