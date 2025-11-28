package com.gameshop.service;

import com.gameshop.model.dto.request.CreateGoodsReceiptRequest;
import com.gameshop.model.dto.response.GoodsReceiptListResponse;
import com.gameshop.model.dto.response.GoodsReceiptResponse;

import java.time.LocalDateTime;

/**
 * Service interface cho GoodsReceipt - Phiếu nhập hàng
 */
public interface GoodsReceiptService {

    /**
     * Tạo phiếu nhập hàng mới
     * - Tạo goods receipt và goods receipt lines
     * - Cập nhật purchase_price theo weighted average
     * - Tạo stock movement để tracking
     * - Cập nhật stock quantity
     */
    GoodsReceiptResponse createGoodsReceipt(CreateGoodsReceiptRequest request);

    /**
     * Lấy thông tin phiếu nhập hàng theo ID
     */
    GoodsReceiptResponse getGoodsReceiptById(Long id);

    /**
     * Lấy tất cả phiếu nhập hàng với filters và pagination
     */
    GoodsReceiptListResponse getAllGoodsReceipts(
            Long supplierId,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            int page,
            int size
    );

    /**
     * Xóa phiếu nhập hàng
     * Note: Thực tế nên soft delete hoặc không cho xóa sau khi đã confirm
     */
    void deleteGoodsReceipt(Long id);
}