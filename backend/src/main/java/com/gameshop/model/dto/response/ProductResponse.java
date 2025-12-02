package com.gameshop.model.dto.response;

import com.gameshop.model.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long productId;
    private String sku;
    private String productName;
    private String description;
    private BigDecimal listPrice;
    private ProductStatus status;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String productImageUrl;
}