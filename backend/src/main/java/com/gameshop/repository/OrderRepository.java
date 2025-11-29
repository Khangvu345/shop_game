package com.gameshop.repository;

import com.gameshop.model.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    /**
     * Calculate total revenue from completed/paid orders within a date range
     * 
     * @param startDate Start of the date range
     * @param endDate   End of the date range
     * @return Total revenue (sum of grandTotal for completed/paid orders)
     */
    @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o " +
            "WHERE (o.status = 'COMPLETED' OR o.paymentStatus IN ('PAID', 'COD_COLLECTED')) " +
            "AND o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumRevenueByDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Count new orders (PENDING/CONFIRMED) created within a date range
     * 
     * @param startDate Start of the date range
     * @param endDate   End of the date range
     * @return Count of new active orders
     */
    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE o.status IN ('PENDING', 'CONFIRMED') " +
            "AND o.createdAt BETWEEN :startDate AND :endDate")
    Integer countNewOrdersByDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
