package com.gameshop.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO cho request đăng ký tài khoản mới (CUSTOMER role)
 */
public record RegisterRequest(
        @NotBlank(message = "Username không được trống")
        @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
        String username,

        @NotBlank(message = "Password không được trống")
        @Size(min = 6, message = "Password phải ít nhất 6 ký tự")
        String password,

        @NotBlank(message = "Email không được trống")
        @Email(message = "Email không hợp lệ")
        String email,

        @NotBlank(message = "Tên đầy đủ không được trống")
        String fullName,

        String phone  // Optional - để link với Customer nếu cần
) {
}
