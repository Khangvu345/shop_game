package com.gameshop.service;

import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.dto.request.CreateStockAdjustmentRequest;
import com.gameshop.model.dto.response.StockMovementResponse;
import com.gameshop.model.enums.StockMovementReason;

import java.time.LocalDateTime;

/**
 * Service interface cho Stock Movement - Tracking lịch sử thay đổi tồn kho
 */
public interface StockMovementService {

    /**
     * Tạo movement mới (core method - tất cả thay đổi stock đều qua đây)
     * 
     * @param productId     ID sản phẩm
     * @param quantityDelta Số lượng thay đổi (+ tăng, - giảm)
     * @param reason        Lý do thay đổi
     * @param referenceNo   Số tham chiếu (invoice number, order number, etc.)
     * @param orderId       Order ID nếu liên quan đến đơn hàng
     */
    void createMovement(Long productId, Integer quantityDelta,
            StockMovementReason reason, String referenceNo, Long orderId);

    /**
     * Lấy lịch sử stock của một sản phẩm (có phân trang)
     */
    PageResponse<StockMovementResponse> getStockHistory(Long productId, int page, int size);

    /**
     * Lấy lịch sử stock theo khoảng thời gian (có phân trang)
     */
    PageResponse<StockMovementResponse> getMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate,
            int page, int size);

    /**
     * Lấy stock movements theo lý do (có phân trang)
     */
    PageResponse<StockMovementResponse> getMovementsByReason(StockMovementReason reason, int page, int size);

    /**
     * Điều chỉnh stock thủ công (admin)
     */
    StockMovementResponse adjustStockManually(CreateStockAdjustmentRequest request);

    /**
     * Lấy tồn kho hiện tại của sản phẩm
     */
    Integer getCurrentStock(Long productId);
}