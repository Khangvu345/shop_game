package com.gameshop.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * Request DTO để cập nhật thông tin nhà cung cấp
 */
public record UpdateSupplierRequest(

        @Size(max = 200, message = "Tên nhà cung cấp không được vượt quá 200 ký tự")
        String name,

        @Email(message = "Email không hợp lệ")
        @Size(max = 150, message = "Email không được vượt quá 150 ký tự")
        String contactEmail,

        @Size(max = 50, message = "Số điện thoại không được vượt quá 50 ký tự")
        String contactPhone
) {}