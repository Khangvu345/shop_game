package com.gameshop.model.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO cho GoodsReceipt
 */
public record GoodsReceiptResponse(
        Long receiptId,
        SupplierResponse supplier,
        String invoiceNumber,
        BigDecimal totalCost,
        String notes,
        LocalDateTime receiptDate,
        List<GoodsReceiptLineDto> items
) {
    public record GoodsReceiptLineDto(
            Long productId,
            String productName,
            Integer quantityReceived,
            BigDecimal unitCost,
            BigDecimal lineTotal
    ) {}
}