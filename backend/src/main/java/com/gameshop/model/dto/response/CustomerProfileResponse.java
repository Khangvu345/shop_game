package com.gameshop.model.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Response DTO cho customer profile
 */
@Schema(description = "Customer profile response")
public record CustomerProfileResponse(
        @Schema(description = "Customer ID", example = "1") Long id,

        @Schema(description = "Full name", example = "Nguyen Van A") String fullName,

        @Schema(description = "Email address (read-only)", example = "customer@example.com") String email,

        @Schema(description = "Phone number", example = "0912345678") String phone,

        @Schema(description = "Birth date", example = "1990-01-15") LocalDate birthDate,

        @Schema(description = "Customer tier", example = "GOLD") String tier,

        @Schema(description = "Loyalty points", example = "1200") Integer points,

        @Schema(description = "Total number of orders", example = "5") Long totalOrders,

        @Schema(description = "Total amount spent", example = "5000000") BigDecimal totalSpent) {
}
