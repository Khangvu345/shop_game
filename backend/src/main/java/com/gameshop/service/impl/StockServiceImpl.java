package com.gameshop.service.impl;

import com.gameshop.repository.OrderRepository;
import com.gameshop.repository.ProductRepository;
import com.gameshop.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation của StockService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final JdbcTemplate jdbcTemplate;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void restoreStockForReturnedOrder(String orderId) {
        log.info("Bắt đầu hoàn trả stock cho đơn hàng ID: {}", orderId);

        // Verify order exists
        if (!orderRepository.existsById(orderId)) {
            log.warn("Không tìm thấy đơn hàng ID: {}", orderId);
            return;
        }

        // Query để lấy tất cả sản phẩm trong đơn hàng và cập nhật stock
        String updateStockSql = "UPDATE product p " +
                "INNER JOIN order_line ol ON p.product_id = ol.product_id " +
                "SET p.stock_quantity = p.stock_quantity + ol.quantity " +
                "WHERE ol.order_id = ?";

        int updatedRows = jdbcTemplate.update(updateStockSql, orderId);
        log.info("Đã cập nhật stock cho {} sản phẩm", updatedRows);

        // Tạo stock movement records
        String insertMovementSql = "INSERT INTO stock_movement (product_id, warehouse_id, quantity_delta, reason, occurred_at, reference_no, order_id) "
                +
                "SELECT ol.product_id, 1, ol.quantity, 'Return', NOW(), CONCAT('RETURN-', ?), ? " +
                "FROM order_line ol " +
                "WHERE ol.order_id = ?";

        int movementRows = jdbcTemplate.update(insertMovementSql, orderId, orderId, orderId);
        log.info("Đã tạo {} bản ghi stock_movement với reason = Return", movementRows);

        log.info("Hoàn tất hoàn trả stock cho đơn hàng ID: {}", orderId);
    }
}
