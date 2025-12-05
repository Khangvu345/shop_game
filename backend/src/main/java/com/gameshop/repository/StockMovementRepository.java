package com.gameshop.repository;

import com.gameshop.model.entity.StockMovement;
import com.gameshop.model.enums.StockMovementReason;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository cho StockMovement - Tracking lịch sử thay đổi tồn kho
 */
@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

        /**
         * Tìm tất cả stock movements của một sản phẩm
         */
        List<StockMovement> findByProduct_ProductIdOrderByOccurredAtDesc(Long productId);

        /**
         * Tìm tất cả stock movements của một sản phẩm (có phân trang)
         */
        Page<StockMovement> findByProduct_ProductIdOrderByOccurredAtDesc(Long productId, Pageable pageable);

        /**
         * Tìm stock movements theo warehouse
         */
        List<StockMovement> findByWarehouse_WarehouseIdOrderByOccurredAtDesc(Long warehouseId);

        /**
         * Tìm stock movements theo lý do
         */
        List<StockMovement> findByReasonOrderByOccurredAtDesc(StockMovementReason reason);

        /**
         * Tìm stock movements theo lý do (có phân trang)
         */
        Page<StockMovement> findByReasonOrderByOccurredAtDesc(StockMovementReason reason, Pageable pageable);

        /**
         * Tìm stock movements theo order
         */
        List<StockMovement> findByOrderIdOrderByOccurredAtDesc(String orderId);

        /**
         * Tìm stock movements trong khoảng thời gian
         */
        List<StockMovement> findByOccurredAtBetweenOrderByOccurredAtDesc(
                        LocalDateTime startDate,
                        LocalDateTime endDate);

        /**
         * Tìm stock movements trong khoảng thời gian (có phân trang)
         */
        Page<StockMovement> findByOccurredAtBetweenOrderByOccurredAtDesc(
                        LocalDateTime startDate,
                        LocalDateTime endDate,
                        Pageable pageable);

        /**
         * Tìm stock movements của sản phẩm trong khoảng thời gian
         */
        List<StockMovement> findByProduct_ProductIdAndOccurredAtBetweenOrderByOccurredAtDesc(
                        Long productId,
                        LocalDateTime startDate,
                        LocalDateTime endDate);
}