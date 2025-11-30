package com.gameshop.model.dto.common;

import java.util.List;

// Record chính phải public
public record CreateOrderRequest(
        Long customerId,
        String paymentMethod, // "COD" or "VNPAY"
        OrderAddressDto address,
        List<OrderItemDto> items) {
    public record OrderAddressDto(
            String recipientName,
            String phone,
            String street,
            String ward,
            String city) {
    }

    public record OrderItemDto(Long productId, Integer quantity) {
    }
}
