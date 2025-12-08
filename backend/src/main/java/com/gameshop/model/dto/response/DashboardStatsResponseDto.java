package com.gameshop.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.gameshop.model.dto.common.PeriodDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO for dashboard statistics
 * Contains key business metrics for admin dashboard
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DashboardStatsResponseDto {

    /**
     * Total revenue from completed/paid orders in the period
     */
    private BigDecimal totalRevenue;

    /**
     * Number of new active orders (PENDING/CONFIRMED) in the period
     */
    private Integer newOrders;

    /**
     * Number of new customer registrations in the period
     */
    private Integer newCustomers;

    /**
     * Total inventory count (sum of stock quantities for active products)
     */
    private Long totalInventory;

    /**
     * Number of products with safe stock (above threshold)
     */
    private Integer safeStockCount;

    /**
     * Number of products with low stock (below threshold but > 0)
     */
    private Integer lowStockCount;

    /**
     * Number of products that are out of stock (stockQuantity = 0)
     */
    private Integer outOfStockCount;

    /**
     * Revenue breakdown with sales, cost, and profit analysis
     */
    private RevenueBreakdownDto revenueBreakdown;

    /**
     * Time period for these statistics
     */
    private PeriodDto period;

    /**
     * Timestamp when these statistics were calculated
     */
    private LocalDateTime lastUpdated;
}
