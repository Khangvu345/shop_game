package com.gameshop.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank(message = "Username không được để trống") @Size(min = 3, max = 100, message = "Username phải từ 3-100 ký tự") String username,

        @NotBlank(message = "Mật khẩu không được để trống") @Size(min = 6, max = 255, message = "Mật khẩu phải từ 6-255 ký tự") String password,

        @NotBlank(message = "Họ tên không được để trống") @Size(max = 255, message = "Họ tên không được quá 255 ký tự") String fullName,

        @NotBlank(message = "Email không được để trống") @Email(message = "Email không hợp lệ") String email,

        @Size(max = 20, message = "Số điện thoại không được quá 20 ký tự") String phoneNumber,

        LocalDate birthDate) {
}
