package com.gameshop.model.dto;
import com.gameshop.model.enums.ShipmentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ShipmentResponse {
    private Long shipmentId;
    private Long orderId;
    private String carrier;
    private String trackingNo;
    private LocalDate estimatedDelivery;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private ShipmentStatus status;
    private String notes;
}