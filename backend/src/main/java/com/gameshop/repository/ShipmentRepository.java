package com.gameshop.repository;
import com.gameshop.model.entity.Shipment;
import com.gameshop.model.enums.ShipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByOrderId(Long orderId);
    // PHẢI CÓ DÒNG NÀY để hỗ trợ phân trang theo status
    Page<Shipment> findByStatus(ShipmentStatus status, Pageable pageable);

    // Dòng này là bonus (không bắt buộc, dùng khi không cần phân trang)
    List<Shipment> findByStatus(ShipmentStatus status);
}