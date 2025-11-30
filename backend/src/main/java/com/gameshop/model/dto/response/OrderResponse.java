package com.gameshop.model.dto.response;

import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentMethod;
import com.gameshop.model.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long orderId,
        Long customerId,
        String customerName,
        AddressDto shippingAddress,
        List<OrderItemDto> items,
        BigDecimal subTotal,
        BigDecimal grandTotal,
        OrderStatus status,
        PaymentStatus paymentStatus,
        PaymentMethod paymentMethod,
        LocalDateTime cancelledAt,
        String cancelReason,
        String cancelledBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public record AddressDto(
            String recipientName,
            String phone,
            String street,
            String ward,
            String city) {
    }

    public record OrderItemDto(
            Long productId,
            String productName,
            Integer quantity,
            BigDecimal price,
            BigDecimal lineTotal) {
    }
}
