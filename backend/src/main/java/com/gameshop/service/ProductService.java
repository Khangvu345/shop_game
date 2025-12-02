package com.gameshop.service;

import com.gameshop.model.dto.request.CreateProductRequest;
import com.gameshop.model.dto.request.UpdateProductRequest;
import com.gameshop.model.dto.response.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    List<ProductResponse> getAllProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice);

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(CreateProductRequest request, String imageUrl);

    ProductResponse updateProduct(Long id, UpdateProductRequest request);

    void deleteProduct(Long id);
}