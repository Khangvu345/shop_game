package com.gameshop.service;

import com.gameshop.model.dto.CreateShipmentRequest;
import com.gameshop.model.dto.ShipmentResponse;
import com.gameshop.model.dto.UpdateShipmentStatusRequest;
import com.gameshop.model.dto.common.PageResponse;
import org.springframework.data.domain.Pageable;

public interface ShipmentService {
    ShipmentResponse createShipment(CreateShipmentRequest request);

    ShipmentResponse updateShipmentStatus(Long shipmentId, UpdateShipmentStatusRequest request);

    ShipmentResponse getShipmentById(Long shipmentId);

    ShipmentResponse getShipmentByOrderId(Long orderId);

    PageResponse<ShipmentResponse> getAllShipments(Pageable pageable, Long orderId, String status);
}