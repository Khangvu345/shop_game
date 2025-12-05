package com.gameshop.model.dto;

import com.gameshop.model.enums.ShipmentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ShipmentResponse(
                Long shipmentId,
                String orderId,
                String carrier,
                String trackingNo,
                LocalDate estimatedDelivery,
                LocalDateTime shippedAt,
                LocalDateTime deliveredAt,
                ShipmentStatus status) {
}