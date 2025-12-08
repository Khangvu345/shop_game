package com.gameshop.model.dto.response;

import java.math.BigDecimal;

/**
 * Cash Flow data transfer object
 * Represents cash in/out flow for a specific period
 */
public record CashFlowDto(
        BigDecimal cashIn, // Thu vào (doanh thu đã thu)
        BigDecimal cashOut, // Chi ra (nhập hàng)
        BigDecimal netCashFlow // Dòng tiền ròng (In - Out)
) {
}
