package com.gameshop.model.dto.response;

import com.gameshop.model.enums.StockMovementReason;

import java.time.LocalDateTime;

/**
 * Response DTO cho StockMovement
 */
public record StockMovementResponse(
        Long movementId,
        Long productId,
        String productName,
        Integer quantityDelta,
        StockMovementReason reason,
        String referenceNo,
        Long orderId,
        LocalDateTime occurredAt
) {}