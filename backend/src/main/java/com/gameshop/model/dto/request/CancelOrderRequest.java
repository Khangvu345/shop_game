package com.gameshop.model.dto.request;

public record CancelOrderRequest(
        String reason,
        Long cancelledBy) {
}
