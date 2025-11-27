package com.gameshop.model.dto.request;

import com.gameshop.model.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record UpdatePaymentStatusRequest(
        @NotNull(message = "Payment status is required") PaymentStatus paymentStatus,

        String collectedBy, // Who collected payment (for COD)
        LocalDateTime collectedAt, // When payment was collected
        String note // Payment note
) {
}
