package com.gameshop.service.impl;

import com.gameshop.exception.BadRequestException;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.request.CreateStockAdjustmentRequest;
import com.gameshop.model.dto.response.StockMovementResponse;
import com.gameshop.model.entity.Product;
import com.gameshop.model.entity.StockMovement;
import com.gameshop.model.entity.Warehouse;
import com.gameshop.model.enums.StockMovementReason;
import com.gameshop.repository.ProductRepository;
import com.gameshop.repository.StockMovementRepository;
import com.gameshop.repository.WarehouseRepository;
import com.gameshop.service.StockMovementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation của StockMovementService
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StockMovementServiceImpl implements StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    private static final Long DEFAULT_WAREHOUSE_ID = 1L;

    @Override
    public void createMovement(Long productId, Integer quantityDelta,
                               StockMovementReason reason, String referenceNo, Long orderId) {
        log.info("Creating stock movement: productId={}, delta={}, reason={}",
                 productId, quantityDelta, reason);

        // 1. Validate product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + productId));

        // 2. Calculate new stock
        int newStock = product.getStockQuantity() + quantityDelta;
        if (newStock < 0) {
            throw new BadRequestException(
                    String.format("Không đủ hàng trong kho! Sản phẩm '%s' chỉ còn %d, yêu cầu %d",
                            product.getProductName(), product.getStockQuantity(), Math.abs(quantityDelta))
            );
        }

        // 3. Update product stock
        product.setStockQuantity(newStock);
        productRepository.save(product);

        // 4. Create stock movement record for tracking
        Warehouse warehouse = warehouseRepository.findById(DEFAULT_WAREHOUSE_ID)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kho mặc định"));

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setWarehouse(warehouse);
        movement.setQuantityDelta(quantityDelta);
        movement.setReason(reason);
        movement.setReferenceNo(referenceNo);
        movement.setOrderId(orderId);
        movement.setOccurredAt(LocalDateTime.now());

        stockMovementRepository.save(movement);

        log.info("Stock movement created successfully: movementId={}, newStock={}",
                 movement.getMovementId(), newStock);
    }

    @Override
    public List<StockMovementResponse> getStockHistory(Long productId) {
        List<StockMovement> movements = stockMovementRepository
                .findByProduct_ProductIdOrderByOccurredAtDesc(productId);

        return movements.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StockMovementResponse> getMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<StockMovement> movements = stockMovementRepository
                .findByOccurredAtBetweenOrderByOccurredAtDesc(startDate, endDate);

        return movements.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StockMovementResponse> getMovementsByReason(StockMovementReason reason) {
        List<StockMovement> movements = stockMovementRepository
                .findByReasonOrderByOccurredAtDesc(reason);

        return movements.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StockMovementResponse adjustStockManually(CreateStockAdjustmentRequest request) {
        log.info("Manual stock adjustment: productId={}, delta={}, reason={}",
                 request.productId(), request.quantityDelta(), request.reason());

        // Validate reason is manual adjustment
        if (request.reason() != StockMovementReason.ManualAdjustment &&
            request.reason() != StockMovementReason.DamagedAdjustment &&
            request.reason() != StockMovementReason.StocktakeAdjustment) {
            throw new BadRequestException("Lý do điều chỉnh không hợp lệ");
        }

        // Create movement
        createMovement(
                request.productId(),
                request.quantityDelta(),
                request.reason(),
                request.notes(),
                null
        );

        // Return latest movement
        List<StockMovement> movements = stockMovementRepository
                .findByProduct_ProductIdOrderByOccurredAtDesc(request.productId());

        return mapToResponse(movements.get(0));
    }

    @Override
    public Integer getCurrentStock(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + productId));

        return product.getStockQuantity();
    }

    // Helper method
    private StockMovementResponse mapToResponse(StockMovement movement) {
        return new StockMovementResponse(
                movement.getMovementId(),
                movement.getProduct().getProductId(),
                movement.getProduct().getProductName(),
                movement.getQuantityDelta(),
                movement.getReason(),
                movement.getReferenceNo(),
                movement.getOrderId(),
                movement.getOccurredAt()
        );
    }
}