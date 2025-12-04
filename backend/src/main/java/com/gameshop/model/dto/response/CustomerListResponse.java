package com.gameshop.model.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO cho danh sách khách hàng (Admin view)
 */
@Schema(description = "Customer list item for admin")
public record CustomerListResponse(
        @Schema(description = "Customer ID", example = "1") Long id,

        @Schema(description = "Full name", example = "Nguyen Van A") String fullName,

        @Schema(description = "Email address", example = "customer@example.com") String email,

        @Schema(description = "Phone number", example = "0912345678") String phone,

        @Schema(description = "Customer tier", example = "GOLD") String tier,

        @Schema(description = "Loyalty points", example = "1200") Integer points,

        @Schema(description = "Total number of orders", example = "5") Long totalOrders,

        @Schema(description = "Total amount spent", example = "5000000") BigDecimal totalSpent,

        @Schema(description = "Registration date", example = "2024-01-15T10:30:00") LocalDateTime registeredDate) {
}
