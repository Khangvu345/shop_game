package com.gameshop.model.dto.request;

import com.gameshop.model.enums.OrderStatus;

public record UpdateOrderStatusRequest(
        OrderStatus status,
        String note) {
}
