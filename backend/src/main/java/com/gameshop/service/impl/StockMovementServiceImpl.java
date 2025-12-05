package com.gameshop.service.impl;

import com.gameshop.exception.BadRequestException;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.common.PageResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
                        StockMovementReason reason, String referenceNo, String orderId) {
                log.info("Creating stock movement: productId={}, delta={}, reason={}",
                                productId, quantityDelta, reason);

                // 1. Validate product
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy sản phẩm ID: " + productId));

                // 2. Calculate new stock
                int newStock = product.getStockQuantity() + quantityDelta;
                if (newStock < 0) {
                        throw new BadRequestException(
                                        String.format("Không đủ hàng trong kho! Sản phẩm '%s' chỉ còn %d, yêu cầu %d",
                                                        product.getProductName(), product.getStockQuantity(),
                                                        Math.abs(quantityDelta)));
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
        public PageResponse<StockMovementResponse> getStockHistory(Long productId, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<StockMovement> movementPage = stockMovementRepository
                                .findByProduct_ProductIdOrderByOccurredAtDesc(productId, pageable);

                List<StockMovementResponse> content = movementPage.getContent().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());

                return new PageResponse<>(
                                content,
                                movementPage.getTotalPages(),
                                movementPage.getTotalElements(),
                                movementPage.getNumber(),
                                movementPage.getSize());
        }

        @Override
        public PageResponse<StockMovementResponse> getMovementsByDateRange(LocalDateTime startDate,
                        LocalDateTime endDate, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<StockMovement> movementPage = stockMovementRepository
                                .findByOccurredAtBetweenOrderByOccurredAtDesc(startDate, endDate, pageable);

                List<StockMovementResponse> content = movementPage.getContent().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());

                return new PageResponse<>(
                                content,
                                movementPage.getTotalPages(),
                                movementPage.getTotalElements(),
                                movementPage.getNumber(),
                                movementPage.getSize());
        }

        @Override
        public PageResponse<StockMovementResponse> getMovementsByReason(StockMovementReason reason, int page,
                        int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<StockMovement> movementPage = stockMovementRepository
                                .findByReasonOrderByOccurredAtDesc(reason, pageable);

                List<StockMovementResponse> content = movementPage.getContent().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());

                return new PageResponse<>(
                                content,
                                movementPage.getTotalPages(),
                                movementPage.getTotalElements(),
                                movementPage.getNumber(),
                                movementPage.getSize());
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
                                null);

                // Return latest movement (just for confirmation, might not be efficient to
                // query all)
                // For simplicity, we can just return a dummy response or query the latest one.
                // Or better, change createMovement to return the movement object.
                // But for now, let's keep it simple and query the latest one as before, but we
                // need to be careful with pagination.
                // Actually, the previous implementation queried ALL movements for the product
                // to get the latest one (index 0).
                // That's inefficient. Let's query just the latest one.

                Pageable pageable = PageRequest.of(0, 1);
                Page<StockMovement> movements = stockMovementRepository
                                .findByProduct_ProductIdOrderByOccurredAtDesc(request.productId(), pageable);

                if (movements.hasContent()) {
                        return mapToResponse(movements.getContent().get(0));
                }

                throw new RuntimeException("Lỗi không xác định: Không tìm thấy movement vừa tạo");
        }

        @Override
        public Integer getCurrentStock(Long productId) {
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy sản phẩm ID: " + productId));

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
                                movement.getOccurredAt());
        }
}