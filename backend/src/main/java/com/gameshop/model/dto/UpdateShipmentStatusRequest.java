package com.gameshop.model.dto;

import com.gameshop.model.enums.ShipmentStatus;
import java.time.LocalDateTime;

public record UpdateShipmentStatusRequest(
        ShipmentStatus status,
        LocalDateTime deliveredAt,
        String recipientName,  // vẫn giữ optional
        String note
) {}