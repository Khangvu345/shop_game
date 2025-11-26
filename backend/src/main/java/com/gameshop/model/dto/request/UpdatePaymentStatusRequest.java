package com.gameshop.model.dto.request;

import com.gameshop.model.enums.PaymentStatus;
import java.time.LocalDateTime;

public record UpdatePaymentStatusRequest(
        PaymentStatus paymentStatus,
        Long collectedBy, // ID của shipper/người thu tiền (cho COD)
        LocalDateTime collectedAt, // Thời gian thu tiền
        String note) {
}
