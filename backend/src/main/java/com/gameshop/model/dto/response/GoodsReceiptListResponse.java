package com.gameshop.model.dto.response;

import java.util.List;

/**
 * Response DTO cho danh sách GoodsReceipt với pagination
 */
public record GoodsReceiptListResponse(
        List<GoodsReceiptResponse> items,
        int totalPages,
        long totalElements,
        int currentPage,
        int pageSize
) {}