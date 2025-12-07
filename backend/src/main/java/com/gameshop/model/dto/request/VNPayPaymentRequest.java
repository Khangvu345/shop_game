package com.gameshop.model.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO để tạo VNPay payment URL
 * Frontend gửi request này để lấy URL thanh toán VNPay
 */
public record VNPayPaymentRequest(
        @NotBlank(message = "Order ID is required") String orderId,

        String bankCode, // Optional: Mã ngân hàng (nếu muốn user chọn ngân hàng tại website)

        String language // Optional: "vn" hoặc "en", mặc định "vn"
) {
}
