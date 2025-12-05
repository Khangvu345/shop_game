package com.gameshop.service;

import com.gameshop.model.dto.common.PeriodDto;
import com.gameshop.model.dto.response.DashboardStatsResponseDto;
import com.gameshop.model.dto.response.RevenueBreakdownDto;
import com.gameshop.model.enums.PeriodType;
import com.gameshop.repository.CustomerRepository;
import com.gameshop.repository.OrderRepository;
import com.gameshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

/**
 * Service for dashboard statistics and business metrics
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    // Low stock threshold constant
    private static final Integer LOW_STOCK_THRESHOLD = 5;

    /**
     * Get dashboard statistics for a specific month
     * 
     * @param month Month (1-12), defaults to current month if null
     * @param year  Year (e.g., 2025), defaults to current year if null
     * @return Dashboard statistics response DTO
     */
    public DashboardStatsResponseDto getMonthlyStats(Integer month, Integer year) {
        // Default to current month/year if not provided
        LocalDate now = LocalDate.now();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        int targetYear = (year != null) ? year : now.getYear();

        // Calculate date range for the month
        YearMonth yearMonth = YearMonth.of(targetYear, targetMonth);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        // Convert to LocalDateTime for repository queries
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Calculate all metrics
        BigDecimal totalRevenue = calculateTotalRevenue(startDateTime, endDateTime);
        Integer newOrders = countNewOrders(startDateTime, endDateTime);
        Integer newCustomers = countNewCustomers(startDateTime, endDateTime);
        Long totalInventory = getTotalInventory();
        Integer lowStockCount = countLowStockProducts(LOW_STOCK_THRESHOLD);
        RevenueBreakdownDto revenueBreakdown = calculateRevenueBreakdown(startDateTime, endDateTime);

        // Create period DTO
        PeriodDto period = new PeriodDto();
        period.setType(PeriodType.MONTH);
        period.setMonth(targetMonth);
        period.setYear(targetYear);

        // Build response
        DashboardStatsResponseDto response = new DashboardStatsResponseDto();
        response.setTotalRevenue(totalRevenue);
        response.setNewOrders(newOrders);
        response.setNewCustomers(newCustomers);
        response.setTotalInventory(totalInventory);
        response.setLowStockCount(lowStockCount);
        response.setRevenueBreakdown(revenueBreakdown);
        response.setPeriod(period);
        response.setLastUpdated(LocalDateTime.now());

        return response;
    }

    /**
     * Calculate total revenue from completed/paid orders
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Total revenue
     */
    private BigDecimal calculateTotalRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.sumRevenueByDateRange(startDate, endDate);
    }

    /**
     * Count new orders (PENDING/CONFIRMED) in date range
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Count of new orders
     */
    private Integer countNewOrders(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.countNewOrdersByDateRange(startDate, endDate);
    }

    /**
     * Count new customer registrations in date range
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Count of new customers
     */
    private Integer countNewCustomers(LocalDateTime startDate, LocalDateTime endDate) {
        return customerRepository.countNewCustomersByDateRange(startDate, endDate);
    }

    /**
     * Get total inventory count (sum of all stock quantities)
     * 
     * @return Total inventory
     */
    private Long getTotalInventory() {
        return productRepository.sumTotalInventory();
    }

    /**
     * Count products with low stock (below threshold)
     * 
     * @param threshold Stock quantity threshold
     * @return Count of low stock products
     */
    private Integer countLowStockProducts(Integer threshold) {
        return productRepository.countLowStockProducts(threshold);
    }

    /**
     * Calculate revenue breakdown with sales, cost, and profit analysis
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Revenue breakdown DTO
     */
    private RevenueBreakdownDto calculateRevenueBreakdown(LocalDateTime startDate, LocalDateTime endDate) {
        // Calculate total sales (revenue)
        BigDecimal totalSales = orderRepository.sumRevenueByDateRange(startDate, endDate);

        // Calculate total cost (purchase price × quantity)
        BigDecimal totalCost = orderRepository.sumCostByDateRange(startDate, endDate);

        // Calculate profit
        BigDecimal totalProfit = totalSales.subtract(totalCost);

        // Calculate profit margin percentage
        BigDecimal profitMargin = BigDecimal.ZERO;
        if (totalSales.compareTo(BigDecimal.ZERO) > 0) {
            profitMargin = totalProfit
                    .divide(totalSales, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        return new RevenueBreakdownDto(totalSales, totalCost, totalProfit, profitMargin);
    }
}
