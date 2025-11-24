package com.gameshop.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCategoryRequest {

    @Size(max = 120, message = "Tên danh mục không được vượt quá 120 ký tự")
    private String categoryName;

    private String description;

    private Long parentId;
}