package com.gameshop.model.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO cho request đăng nhập
 */
public record LoginRequest(
        @NotBlank(message = "Username không được trống")
        String username,

        @NotBlank(message = "Password không được trống")
        String password
) {
}
