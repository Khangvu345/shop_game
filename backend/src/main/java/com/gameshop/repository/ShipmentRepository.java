package com.gameshop.repository;

import com.gameshop.model.entity.Shipment;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.ShipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Transactional
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByOrderId(String orderId);

    // PHẢI CÓ DÒNG NÀY để hỗ trợ phân trang theo status
    Page<Shipment> findByStatus(ShipmentStatus status, Pageable pageable);

    // Dòng này là bonus (không bắt buộc, dùng khi không cần phân trang)
    List<Shipment> findByStatus(ShipmentStatus status);

    @Query("SELECT o.status FROM Order o WHERE o.id = :id")
    Optional<OrderStatus> getOrderStatusById(@Param("id") String id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Order o SET o.status = :status WHERE o.id = :id")
    int updateOrderStatus(@Param("id") String orderId, @Param("status") OrderStatus status);
}