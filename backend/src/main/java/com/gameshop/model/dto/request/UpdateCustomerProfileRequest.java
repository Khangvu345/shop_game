package com.gameshop.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

/**
 * Request DTO để cập nhật customer profile
 * LƯU Ý: Email không cho phép sửa (read-only)
 */
@Schema(description = "Update customer profile request")
public record UpdateCustomerProfileRequest(
        @Schema(description = "Full name", example = "Nguyen Van A") @NotBlank(message = "Full name is required") String fullName,

        @Schema(description = "Phone number (10 digits, starts with 0)", example = "0912345678") @Pattern(regexp = "^0\\d{9}$", message = "Phone number must be 10 digits and start with 0") String phone,

        @Schema(description = "Birth date", example = "1990-01-15") LocalDate birthDate) {
}
