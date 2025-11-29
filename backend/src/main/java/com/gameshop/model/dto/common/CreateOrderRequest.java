package com.gameshop.model.dto.common;

import java.util.List;

// Record chính phải public
public record CreateOrderRequest(
        Long customerId,
        OrderAddressDto address,
        List<OrderItemDto> items
) {
    public record OrderAddressDto(
        String recipientName,
        String phone,
        String street,
        String ward,
        String district,
        String city
    ) {}


    public record OrderItemDto(Long productId, Integer quantity) {}
}