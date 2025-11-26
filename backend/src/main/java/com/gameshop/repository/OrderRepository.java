package com.gameshop.repository;

import com.gameshop.model.entity.Order;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find orders by customer ID with pagination
     */
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    /**
     * Find all orders with optional filters
     */
    @Query("SELECT o FROM Order o WHERE " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) AND " +
            "(:customerId IS NULL OR o.customer.id = :customerId) AND " +
            "(:startDate IS NULL OR CAST(o.createdAt AS LocalDate) >= :startDate) AND " +
            "(:endDate IS NULL OR CAST(o.createdAt AS LocalDate) <= :endDate)")
    Page<Order> findAllWithFilters(
            @Param("status") OrderStatus status,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("customerId") Long customerId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);
}
