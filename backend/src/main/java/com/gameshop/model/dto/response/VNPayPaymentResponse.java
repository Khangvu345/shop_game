package com.gameshop.model.dto.response;

import java.time.LocalDateTime;

/**
 * Response DTO cho VNPay payment URL creation
 * Trả về cho frontend sau khi tạo payment URL thành công
 */
public record VNPayPaymentResponse(
        String paymentUrl, // URL để redirect user đến VNPay
        String orderId, // Mã đơn hàng
        String txnRef, // Mã tham chiếu giao dịch VNPay
        Long amount, // Số tiền thanh toán (VND)
        LocalDateTime createdAt // Thời gian tạo
) {
}
