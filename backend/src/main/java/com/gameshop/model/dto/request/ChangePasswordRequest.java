package com.gameshop.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO để đổi mật khẩu
 */
@Schema(description = "Change password request")
public record ChangePasswordRequest(
        @Schema(description = "Current password", example = "oldpass123") @NotBlank(message = "Old password is required") String oldPassword,

        @Schema(description = "New password (minimum 6 characters)", example = "newpass123") @NotBlank(message = "New password is required") @Size(min = 6, message = "New password must be at least 6 characters") String newPassword,

        @Schema(description = "Confirm new password", example = "newpass123") @NotBlank(message = "Confirm password is required") String confirmPassword) {
}
