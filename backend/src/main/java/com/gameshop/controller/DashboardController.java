package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.response.DashboardStatsResponseDto;
import com.gameshop.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for admin dashboard statistics
 */
@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Admin Dashboard APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Get dashboard statistics for a specific period
     * 
     * @param month   Month (1-12), optional - defaults to current month
     * @param year    Year (e.g., 2025), optional - defaults to current year
     * @param quarter Quarter (1-4), optional - reserved for future use
     * @return Dashboard statistics response
     */
    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics", description = "Retrieve key business metrics including revenue, orders, customers, and inventory statistics for the specified period")
    public ResponseEntity<ApiResponse<DashboardStatsResponseDto>> getDashboardStats(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer quarter) {

        // Currently only supports monthly stats; quarter parameter reserved for future
        DashboardStatsResponseDto stats = dashboardService.getMonthlyStats(month, year);

        ApiResponse<DashboardStatsResponseDto> response = ApiResponse.success(
                "Thống kê Dashboard đã lấy thành công",
                stats);

        return ResponseEntity.ok(response);
    }
}
