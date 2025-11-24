package com.gameshop.service.impl;

import com.gameshop.model.dto.response.CategoryResponse;
import com.gameshop.model.entity.Category;
import com.gameshop.repository.CategoryRepository;
import com.gameshop.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Tự động tạo Constructor cho các biến final (thay cho @Autowired)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        //Lấy toàn bộ dữ liệu
        List<Category> categories = categoryRepository.findAll();
        return categories.stream() // Dùng Java Stream để duyệt qua từng phần tử và chuyển đổi
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
