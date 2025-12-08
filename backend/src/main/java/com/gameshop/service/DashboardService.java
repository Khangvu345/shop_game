package com.gameshop.service;

import com.gameshop.model.dto.common.PeriodDto;
import com.gameshop.model.dto.response.DashboardStatsResponseDto;
import com.gameshop.model.dto.response.RevenueBreakdownDto;
import com.gameshop.model.dto.response.CashFlowDto;
import com.gameshop.model.dto.response.CapitalManagementDto;
import com.gameshop.model.enums.PeriodType;
import com.gameshop.repository.CustomerRepository;
import com.gameshop.repository.OrderRepository;
import com.gameshop.repository.ProductRepository;
import com.gameshop.repository.GoodsReceiptRepository;
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
    private final GoodsReceiptRepository goodsReceiptRepository;

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

        // Tính 3 mức hàng tồn kho
        Integer outOfStockCount = countOutOfStockProducts();
        Integer lowStockCount = countLowStockProducts(LOW_STOCK_THRESHOLD);
        Integer totalActiveProducts = productRepository.countActiveProducts();
        Integer safeStockCount = totalActiveProducts - lowStockCount - outOfStockCount;

        RevenueBreakdownDto revenueBreakdown = calculateRevenueBreakdown(startDateTime, endDateTime);

        // Tính toán dòng tiền dòng và quản lý vốn
        CashFlowDto cashFlow = calculateCashFlow(startDateTime, endDateTime);
        CapitalManagementDto capitalManagement = calculateCapitalManagement(startDateTime, endDateTime);

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
        response.setSafeStockCount(safeStockCount);
        response.setLowStockCount(lowStockCount);
        response.setOutOfStockCount(outOfStockCount);
        response.setRevenueBreakdown(revenueBreakdown);
        response.setCashFlow(cashFlow);
        response.setCapitalManagement(capitalManagement);
        response.setPeriod(period);
        response.setLastUpdated(LocalDateTime.now());

        return response;
    }

    /**
     * Tính tổng doanh thu từ các đơn hàng đã hoàn thành
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Total revenue
     */
    private BigDecimal calculateTotalRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.sumRevenueByDateRange(startDate, endDate);
    }

    /**
     * Đếm số lượng đơn hàng mới (PENDING/CONFIRMED) trong khoảng thời gian
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Count of new orders
     */
    private Integer countNewOrders(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.countNewOrdersByDateRange(startDate, endDate);
    }

    /**
     * Đếm số lượng khách hàng mới trong khoảng thời gian
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Count of new customers
     */
    private Integer countNewCustomers(LocalDateTime startDate, LocalDateTime endDate) {
        return customerRepository.countNewCustomersByDateRange(startDate, endDate);
    }

    /**
     * Tổng số lượng tồn kho (tổng số lượng tồn kho của tất cả các sản phẩm)
     * 
     * @return Total inventory
     */
    private Long getTotalInventory() {
        return productRepository.sumTotalInventory();
    }

    /**
     * Đếm số lượng sản phẩm có tồn kho thấp (dưới ngưỡng)
     * 
     * @param threshold Stock quantity threshold
     * @return Count of low stock products
     */
    private Integer countLowStockProducts(Integer threshold) {
        return productRepository.countLowStockProducts(threshold);
    }

    /**
     * Đếm số lượng sản phẩm hết hàng
     * 
     * @return 
     */
    private Integer countOutOfStockProducts() {
        return productRepository.countOutOfStockProducts();
    }

    /**
     * Tính toán phân tích doanh thu với các thông tin về doanh thu, chi phí và lợi nhuận
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

    /**
     * Tính toán dòng tiền
     * Thu vào - Chi ra = Dòng tiền ròng
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Cash flow DTO
     */
    private CashFlowDto calculateCashFlow(LocalDateTime startDate, LocalDateTime endDate) {
        // Thu vào = Doanh thu đã thu (PAID + COD_COLLECTED)
        BigDecimal cashIn = orderRepository.sumRevenueByDateRange(startDate, endDate);

        // Chi ra = Tổng nhập hàng trong kỳ
        BigDecimal cashOut = goodsReceiptRepository.sumGoodsReceiptCostByDateRange(startDate, endDate);

        // Dòng tiền ròng = Thu vào - Chi ra
        BigDecimal netCashFlow = cashIn.subtract(cashOut);

        return new CashFlowDto(cashIn, cashOut, netCashFlow);
    }

    /**
     * Tính toán quản lý vốn
     * Bao gồm: Tổng nhập hàng, Giá trị tồn kho, Vòng quay tồn kho
     * 
     * @param startDate Start of date range
     * @param endDate   End of date range
     * @return Capital management DTO
     */
    private CapitalManagementDto calculateCapitalManagement(LocalDateTime startDate, LocalDateTime endDate) {
        // Tổng chi phí nhập hàng trong kỳ
        BigDecimal totalGoodsReceiptCost = goodsReceiptRepository
                .sumGoodsReceiptCostByDateRange(startDate, endDate);

        // Giá trị tồn kho hiện tại (snapshot - không phụ thuộc thời gian)
        BigDecimal inventoryValue = productRepository.calculateTotalInventoryValue();

        // Vòng quay tồn kho = COGS / Inventory Value
        // COGS = Chi phí hàng đã bán trong kỳ
        BigDecimal cogs = orderRepository.sumCostByDateRange(startDate, endDate);
        BigDecimal inventoryTurnover = BigDecimal.ZERO;

        if (inventoryValue.compareTo(BigDecimal.ZERO) > 0) {
            inventoryTurnover = cogs.divide(inventoryValue, 2, RoundingMode.HALF_UP);
        }

        return new CapitalManagementDto(totalGoodsReceiptCost, inventoryValue, inventoryTurnover);
    }
}
