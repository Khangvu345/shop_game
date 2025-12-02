package com.gameshop.repository;

import com.gameshop.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByProductNameContainingIgnoreCase(String keyword);

    List<Product> findByCategory_CategoryId(Long categoryId);

    List<Product> findByCategory_CategoryIdIn(List<Long> categoryIds);

    /**
     * Calculate total inventory (sum of stock quantities) for active products
     * 
     * @return Total stock quantity across all active products
     */
    @Query("SELECT COALESCE(SUM(p.stockQuantity), 0) FROM Product p " +
            "WHERE p.status = 'Active'")
    Long sumTotalInventory();

    /**
     * Count products with low stock (below threshold)
     * 
     * @param threshold Stock quantity threshold
     * @return Count of products with stock below threshold
     */
    @Query("SELECT COUNT(p) FROM Product p " +
            "WHERE p.stockQuantity < :threshold AND p.status = 'Active'")
    Integer countLowStockProducts(@Param("threshold") Integer threshold);
    @Modifying
    @Query(value = """
        UPDATE product p
        JOIN order_line ol ON ol.product_id = p.product_id
        SET p.stock_quantity = p.stock_quantity + ol.quantity
        WHERE ol.order_id = :orderId
        """, nativeQuery = true)
    int restoreStockByOrderId(@Param("orderId") Long orderId);
}