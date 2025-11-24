package com.gameshop.service.impl;

import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.request.CreateProductRequest;
import com.gameshop.model.dto.request.UpdateProductRequest;
import com.gameshop.model.dto.response.ProductResponse;
import com.gameshop.model.entity.Category;
import com.gameshop.model.entity.Product;
import com.gameshop.repository.CategoryRepository;
import com.gameshop.repository.ProductRepository;
import com.gameshop.repository.specification.ProductSpecification;
import com.gameshop.service.CategoryService;
import com.gameshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    @Override
    public List<ProductResponse> getAllProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        log.debug("Filter params - keyword: {}, categoryId: {}, minPrice: {}, maxPrice: {}",
                  keyword, categoryId, minPrice, maxPrice);

        // Lấy danh sách categoryIds (bao gồm children) nếu có categoryId
        List<Long> categoryIds = null;
        if (categoryId != null) {
            categoryIds = categoryService.getAllCategoryIdsIncludingChildren(categoryId);
            log.debug("Lọc theo categoryId: {} (bao gồm {} danh mục con)", categoryId, categoryIds.size() - 1);
        }

        // Build Specification với tất cả filters
        Specification<Product> spec = ProductSpecification.filterProducts(
                keyword,
                categoryIds,
                minPrice,
                maxPrice
        );

        // Thực hiện query với Specification
        List<Product> products = productRepository.findAll(spec);
        log.debug("Tìm thấy {} sản phẩm", products.size());

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        return mapToResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        log.info("Tạo sản phẩm mới: {}", request.getProductName());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        Product product = new Product();
        product.setSku(request.getSku());
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setListPrice(request.getListPrice());
        product.setStatus(request.getStatus());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);
        log.info("Đã tạo sản phẩm với ID: {}", savedProduct.getProductId());

        return mapToResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        log.info("Cập nhật sản phẩm ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        if (request.getSku() != null) {
            product.setSku(request.getSku());
        }
        if (request.getProductName() != null) {
            product.setProductName(request.getProductName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getListPrice() != null) {
            product.setListPrice(request.getListPrice());
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));
            product.setCategory(category);
        }

        Product updatedProduct = productRepository.save(product);
        log.info("Đã cập nhật sản phẩm ID: {}", id);

        return mapToResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Xóa sản phẩm ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        productRepository.delete(product);
        log.info("Đã xóa sản phẩm ID: {}", id);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setSku(product.getSku());
        response.setProductName(product.getProductName());
        response.setDescription(product.getDescription());
        response.setListPrice(product.getListPrice());
        response.setStatus(product.getStatus());
        response.setCategoryId(product.getCategory().getCategoryId());
        response.setCategoryName(product.getCategory().getCategoryName());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }
}