package com.gameshop.model.dto.request;

import com.gameshop.model.enums.StockMovementReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO để điều chỉnh tồn kho thủ công
 */
public record CreateStockAdjustmentRequest(

        @NotNull(message = "Product ID không được để trống")
        Long productId,

        @NotNull(message = "Số lượng điều chỉnh không được để trống")
        Integer quantityDelta, // Số dương = tăng, số âm = giảm

        @NotNull(message = "Lý do điều chỉnh không được để trống")
        StockMovementReason reason,

        @NotBlank(message = "Ghi chú không được để trống")
        String notes
) {}