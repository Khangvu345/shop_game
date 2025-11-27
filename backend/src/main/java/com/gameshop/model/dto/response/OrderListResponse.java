package com.gameshop.model.dto.response;

import java.util.List;

public record OrderListResponse(
        List<OrderResponse> content,
        int totalPages,
        long totalElements,
        int currentPage,
        int pageSize) {
}
