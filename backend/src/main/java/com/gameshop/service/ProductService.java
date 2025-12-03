package com.gameshop.service;

import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.dto.request.CreateProductRequest;
import com.gameshop.model.dto.request.UpdateProductRequest;
import com.gameshop.model.dto.response.ProductResponse;

import java.math.BigDecimal;

public interface ProductService {

    PageResponse<ProductResponse> getAllProducts(String keyword, Long categoryId, BigDecimal minPrice,
            BigDecimal maxPrice, int page, int size);

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(CreateProductRequest request, String imageUrl);

    ProductResponse updateProduct(Long id, UpdateProductRequest request);

    ProductResponse updateProduct(Long id, UpdateProductRequest request, String imageUrl);

    void deleteProduct(Long id);
}