package com.gameshop.model.dto.common;

import java.util.List;

public record PageResponse<T>(
        List<T> content,
        int totalPages,
        long totalElements,
        int currentPage,
        int pageSize) {
}
