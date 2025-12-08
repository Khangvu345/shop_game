package com.gameshop.model.dto.response;

import java.math.BigDecimal;

/**
 * Capital management metrics DTO
 * Represents inventory value, goods receipt costs, and turnover rate
 */
public record CapitalManagementDto(
        BigDecimal totalGoodsReceiptCost, // Tổng chi phí nhập hàng (trong kỳ)
        BigDecimal inventoryValue, // Giá trị tồn kho hiện tại
        BigDecimal inventoryTurnover // Vòng quay tồn kho (COGS / Inventory Value)
) {
}
