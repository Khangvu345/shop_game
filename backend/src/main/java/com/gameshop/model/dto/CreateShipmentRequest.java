package com.gameshop.model.dto;
import java.time.LocalDate;

public class CreateShipmentRequest {
    private Long orderId;
    private String carrier;
    private String trackingNo;
    private LocalDate estimatedDelivery;
    private String notes;
}