package com.gameshop.service;

/**
 * Service xử lý logic liên quan đến tồn kho
 */
public interface StockService {

    /**
     * Hoàn trả stock khi khách hàng trả hàng
     * 
     * @param orderId ID của đơn hàng bị trả
     */
    void restoreStockForReturnedOrder(Long orderId);
}
