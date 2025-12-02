package com.gameshop.service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import com.gameshop.repository.ProductRepository;

@RequiredArgsConstructor
@Service
public class StockService {
private final ProductRepository productRepository;

    @Transactional
    public void restoreStockForReturnedOrder(Long orderId) {
        int updated = productRepository.restoreStockByOrderId(orderId);
        System.out.println("ĐÃ RESTORE STOCK CHO " + updated + " sản phẩm – Đơn hàng ID: " + orderId);
    }
}