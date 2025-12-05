package com.gameshop.repository;

import com.gameshop.model.entity.Order;
import com.gameshop.model.enums.OrderStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {
        Page<Order> findByCustomerId(Long customerId, Pageable pageable);

        @Query("SELECT o.status FROM Order o WHERE o.id = :id")
        Optional<OrderStatus> getOrderStatusById(@Param("id") String id);

        // CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG - Dành cho ShipmentService
        @Modifying(clearAutomatically = true)
        @Transactional
        @Query("UPDATE Order o SET o.status = :status WHERE o.id = :orderId")
        int updateOrderStatus(@Param("orderId") String orderId,
                        @Param("status") OrderStatus status);

        /**
         * Đếm số lượng đơn hàng của khách hàng
         * 
         * @param customerId ID khách hàng
         * @return Tổng số đơn hàng
         */
        Long countByCustomerId(Long customerId);

        /**
         * Tính tổng tiền khách hàng đã chi tiêu
         * 
         * @param customerId ID khách hàng
         * @return Tổng tiền (NULL nếu chưa có đơn hàng)
         */
        @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.customer.id = :customerId")
        BigDecimal getTotalSpentByCustomerId(@Param("customerId") Long customerId);

        /**
         * Tính tổng doanh thu trong khoảng thời gian (Dashboard)
         * Tính các đơn hàng đã thanh toán (PAID) và COD đã thu tiền (COD_COLLECTED)
         * 
         * @param startDate Ngày bắt đầu
         * @param endDate   Ngày kết thúc
         * @return Tổng doanh thu
         */
        @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o " +
                        "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
                        "AND (o.paymentStatus = 'PAID' OR o.paymentStatus = 'COD_COLLECTED')")
        BigDecimal sumRevenueByDateRange(@Param("startDate") java.time.LocalDateTime startDate,
                        @Param("endDate") java.time.LocalDateTime endDate);

        /**
         * Tính tổng chi phí (giá vốn) trong khoảng thời gian (Dashboard)
         * Tính tổng (quantity × purchasePrice) của tất cả sản phẩm trong đơn hàng đã
         * thanh toán (PAID hoặc COD_COLLECTED)
         * 
         * @param startDate Ngày bắt đầu
         * @param endDate   Ngày kết thúc
         * @return Tổng chi phí
         */
        @Query("SELECT COALESCE(SUM(ol.quantity * p.purchasePrice), 0) " +
                        "FROM OrderLine ol " +
                        "JOIN ol.product p " +
                        "JOIN ol.order o " +
                        "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
                        "AND (o.paymentStatus = 'PAID' OR o.paymentStatus = 'COD_COLLECTED')")
        BigDecimal sumCostByDateRange(@Param("startDate") java.time.LocalDateTime startDate,
                        @Param("endDate") java.time.LocalDateTime endDate);

        /**
         * Đếm số đơn hàng mới trong khoảng thời gian (Dashboard)
         * Đếm các đơn hàng PENDING hoặc CONFIRMED
         * 
         * @param startDate Ngày bắt đầu
         * @param endDate   Ngày kết thúc
         * @return Số đơn hàng mới
         */
        @Query("SELECT COUNT(o) FROM Order o " +
                        "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
                        "AND (o.status = 'PENDING' OR o.status = 'CONFIRMED')")
        Integer countNewOrdersByDateRange(@Param("startDate") java.time.LocalDateTime startDate,
                        @Param("endDate") java.time.LocalDateTime endDate);
}
