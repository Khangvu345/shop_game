package com.gameshop.model.dto;
import com.gameshop.model.enums.ShipmentStatus;
import java.time.LocalDateTime;

public class UpdateShipmentStatusRequest {
    private ShipmentStatus status;
    private LocalDateTime deliveredAt;
    private String recipientName; // optional
    private String note;
}
