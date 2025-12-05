package com.gameshop.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for revenue breakdown analysis
 * Contains sales, cost, and profit metrics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RevenueBreakdownDto {

    /**
     * Total sales revenue (sum of grand_total from paid orders)
     */
    private BigDecimal totalSales;

    /**
     * Total cost (sum of quantity × purchase_price for products in paid orders)
     */
    private BigDecimal totalCost;

    /**
     * Total profit (totalSales - totalCost)
     */
    private BigDecimal totalProfit;

    /**
     * Profit margin percentage ((totalProfit / totalSales) × 100)
     */
    private BigDecimal profitMargin;
}
