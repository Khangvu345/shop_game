package com.gameshop.repository;
import com.gameshop.model.entity.Shipment;
import com.gameshop.model.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByOrderId(Long orderId);
    List<Shipment> findByStatus(ShipmentStatus status);
}