package com.gameshop.repository.specification;

import com.gameshop.model.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filterProducts(
            String keyword,
            List<Long> categoryIds,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by keyword (tìm trong tên sản phẩm)
            if (keyword != null && !keyword.trim().isEmpty()) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("productName")),
                                "%" + keyword.trim().toLowerCase() + "%"));
            }

            // Filter by category IDs (bao gồm cả children)
            if (categoryIds != null && !categoryIds.isEmpty()) {
                predicates.add(root.get("category").get("categoryId").in(categoryIds));
            }

            // Filter by minPrice (chỉ filter khi > 0)
            if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) > 0) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(root.get("listPrice"), minPrice));
            }

            // Filter by maxPrice (chỉ filter khi > 0)
            if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) > 0) {
                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(root.get("listPrice"), maxPrice));
            }

            // Filter by status
            if (status != null && !status.trim().isEmpty()) {
                predicates.add(
                        criteriaBuilder.equal(root.get("status"), status));
            }

            // Kết hợp tất cả predicates với AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}