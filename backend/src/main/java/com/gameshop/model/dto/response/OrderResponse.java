package com.gameshop.model.dto.response;

import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentMethod;
import com.gameshop.model.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        Long customerId,
        String customerName,
        OrderAddressResponse shippingAddress,
        List<OrderLineResponse> orderLines,
        BigDecimal subTotal,
        BigDecimal grandTotal,
        OrderStatus status,
        PaymentStatus paymentStatus,
        PaymentMethod paymentMethod,
        LocalDateTime cancelledAt,
        String cancelReason,
        Long cancelledBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public record OrderAddressResponse(
            String recipientName,
            String phone,
            String street,
            String ward,
            String district,
            String city) {
    }

    public record OrderLineResponse(
            Long id,
            Long productId,
            String productName,
            int quantity,
            BigDecimal price,
            BigDecimal lineTotal) {
    }
}
