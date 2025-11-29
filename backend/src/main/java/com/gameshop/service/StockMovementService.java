package com.gameshop.service;

import com.gameshop.model.dto.request.CreateStockAdjustmentRequest;
import com.gameshop.model.dto.response.StockMovementResponse;
import com.gameshop.model.enums.StockMovementReason;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface cho Stock Movement - Tracking lịch sử thay đổi tồn kho
 */
public interface StockMovementService {

    /**
     * Tạo movement mới (core method - tất cả thay đổi stock đều qua đây)
     * @param productId ID sản phẩm
     * @param quantityDelta Số lượng thay đổi (+ tăng, - giảm)
     * @param reason Lý do thay đổi
     * @param referenceNo Số tham chiếu (invoice number, order number, etc.)
     * @param orderId Order ID nếu liên quan đến đơn hàng
     */
    void createMovement(Long productId, Integer quantityDelta,
                       StockMovementReason reason, String referenceNo, Long orderId);

    /**
     * Lấy lịch sử stock của một sản phẩm
     */
    List<StockMovementResponse> getStockHistory(Long productId);

    /**
     * Lấy lịch sử stock theo khoảng thời gian
     */
    List<StockMovementResponse> getMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Lấy stock movements theo lý do
     */
    List<StockMovementResponse> getMovementsByReason(StockMovementReason reason);

    /**
     * Điều chỉnh stock thủ công (admin)
     */
    StockMovementResponse adjustStockManually(CreateStockAdjustmentRequest request);

    /**
     * Lấy tồn kho hiện tại của sản phẩm
     */
    Integer getCurrentStock(Long productId);
}