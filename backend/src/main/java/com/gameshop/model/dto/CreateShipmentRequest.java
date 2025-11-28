package com.gameshop.model.dto;

import java.time.LocalDate;

public record CreateShipmentRequest(
        Long orderId,
        String carrier,
        String trackingNo,
        LocalDate estimatedDelivery,
        String notes
) {}