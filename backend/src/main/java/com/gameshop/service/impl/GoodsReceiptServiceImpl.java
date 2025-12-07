package com.gameshop.service.impl;

import com.gameshop.exception.BadRequestException;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.request.CreateGoodsReceiptRequest;
import com.gameshop.model.dto.request.UpdateGoodsReceiptRequest;
import com.gameshop.model.dto.response.GoodsReceiptListResponse;
import com.gameshop.model.dto.response.GoodsReceiptResponse;
import com.gameshop.model.dto.response.SupplierResponse;
import com.gameshop.model.entity.*;
import com.gameshop.model.enums.StockMovementReason;
import com.gameshop.repository.GoodsReceiptRepository;
import com.gameshop.repository.ProductRepository;
import com.gameshop.repository.SupplierRepository;
import com.gameshop.repository.WarehouseRepository;
import com.gameshop.service.GoodsReceiptService;
import com.gameshop.service.StockMovementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation của GoodsReceiptService với weighted average cost calculation
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class GoodsReceiptServiceImpl implements GoodsReceiptService {

    private final GoodsReceiptRepository goodsReceiptRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockMovementService stockMovementService;

    private static final Long DEFAULT_WAREHOUSE_ID = 1L;

    @Override
    public GoodsReceiptResponse createGoodsReceipt(CreateGoodsReceiptRequest request) {
        log.info("Creating goods receipt: invoice={}, supplier={}, items={}",
                request.invoiceNumber(), request.supplierId(), request.items().size());

        // 1. Validate supplier
        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp ID: " + request.supplierId()));

        // 2. Validate unique invoice number
        if (goodsReceiptRepository.existsByInvoiceNumber(request.invoiceNumber())) {
            throw new BadRequestException("Số hóa đơn '" + request.invoiceNumber() + "' đã tồn tại");
        }

        // 3. Get warehouse
        Warehouse warehouse = warehouseRepository.findById(DEFAULT_WAREHOUSE_ID)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kho mặc định"));

        // 4. Create goods receipt
        GoodsReceipt receipt = new GoodsReceipt();
        receipt.setSupplier(supplier);
        receipt.setInvoiceNumber(request.invoiceNumber());
        receipt.setNotes(request.notes());
        receipt.setReceiptDate(LocalDateTime.now());
        receipt.setLines(new ArrayList<>());

        BigDecimal totalCost = BigDecimal.ZERO;

        // 5. Process each item
        for (CreateGoodsReceiptRequest.GoodsReceiptItemDto itemDto : request.items()) {
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + itemDto.productId()));

            // 6. Calculate weighted average cost
            int oldQty = product.getStockQuantity();
            BigDecimal oldCost = product.getPurchasePrice() != null ? product.getPurchasePrice() : BigDecimal.ZERO;
            int newQty = itemDto.quantity();
            BigDecimal newCost = itemDto.unitCost();

            BigDecimal weightedAvgCost = calculateWeightedAverageCost(oldQty, oldCost, newQty, newCost);

            log.info(
                    "Weighted average cost calculation: product={}, oldQty={}, oldCost={}, newQty={}, newCost={}, avgCost={}",
                    product.getProductName(), oldQty, oldCost, newQty, newCost, weightedAvgCost);

            // 7. Update product purchase price
            product.setPurchasePrice(weightedAvgCost);
            productRepository.save(product);

            // 8. Create stock movement (this will update stock_quantity)
            stockMovementService.createMovement(
                    product.getProductId(),
                    itemDto.quantity(),
                    StockMovementReason.GoodsReceipt,
                    request.invoiceNumber(),
                    null);

            // 9. Create goods receipt line
            GoodsReceiptLine line = new GoodsReceiptLine();
            GoodsReceiptLinePK linePk = new GoodsReceiptLinePK();
            linePk.setReceiptId(null); // Will be set after receipt is saved
            linePk.setLineNo(receipt.getLines().size() + 1);

            line.setId(linePk);
            line.setGoodsReceipt(receipt);
            line.setProduct(product);
            line.setWarehouse(warehouse);
            line.setQuantityReceived(itemDto.quantity());
            line.setUnitCost(itemDto.unitCost());

            receipt.getLines().add(line);

            // Calculate line total
            BigDecimal lineTotal = itemDto.unitCost().multiply(BigDecimal.valueOf(itemDto.quantity()));
            totalCost = totalCost.add(lineTotal);
        }

        // 10. Set total cost
        receipt.setTotalCost(totalCost);

        // 11. Save goods receipt
        GoodsReceipt saved = goodsReceiptRepository.save(receipt);

        log.info("Goods receipt created successfully: id={}, totalCost={}", saved.getReceiptId(), totalCost);

        return mapToResponse(saved);
    }

    @Override
    public GoodsReceiptResponse getGoodsReceiptById(Long id) {
        GoodsReceipt receipt = goodsReceiptRepository.findByIdWithLines(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu nhập hàng ID: " + id));

        return mapToResponse(receipt);
    }

    @Override
    public GoodsReceiptListResponse getAllGoodsReceipts(
            Long supplierId, LocalDateTime fromDate, LocalDateTime toDate,
            int page, int size) {

        // Adjust toDate to end of day if it's midnight (handles date-only inputs from
        // frontend)
        final LocalDateTime effectiveToDate;
        if (toDate != null && toDate.toLocalTime().equals(java.time.LocalTime.MIN)) {
            effectiveToDate = toDate.with(java.time.LocalTime.MAX);
        } else {
            effectiveToDate = toDate;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "receiptDate"));

        Specification<GoodsReceipt> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (supplierId != null) {
                predicates.add(criteriaBuilder.equal(root.get("supplier").get("supplierId"), supplierId));
            }
            if (fromDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("receiptDate"), fromDate));
            }
            if (effectiveToDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("receiptDate"), effectiveToDate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<GoodsReceipt> receiptPage = goodsReceiptRepository.findAll(spec, pageable);

        List<GoodsReceiptResponse> responses = receiptPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new GoodsReceiptListResponse(
                responses,
                receiptPage.getTotalPages(),
                receiptPage.getTotalElements(),
                receiptPage.getNumber(),
                receiptPage.getSize());
    }

    @Override
    @Transactional
    public GoodsReceiptResponse updateGoodsReceipt(Long id, UpdateGoodsReceiptRequest request) {
        log.info("Updating goods receipt: id={}, reason={}", id, request.updateReason());

        // 1. Validate goods receipt exists
        GoodsReceipt receipt = goodsReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu nhập hàng ID: " + id));

        // 2. Update metadata only (NOT items/supplier to avoid stock tracking chaos)
        if (request.invoiceNumber() != null && !request.invoiceNumber().isBlank()) {
            // Check if new invoice number is already used by another receipt
            goodsReceiptRepository.findByInvoiceNumber(request.invoiceNumber())
                    .ifPresent(existing -> {
                        if (!existing.getReceiptId().equals(id)) {
                            throw new BadRequestException(
                                    "Số hóa đơn '" + request.invoiceNumber() + "' đã tồn tại trong phiếu nhập khác");
                        }
                    });
            receipt.setInvoiceNumber(request.invoiceNumber());
        }

        if (request.notes() != null) {
            // Append update reason to notes for audit trail
            String updatedNotes = request.notes() + "\n[Cập nhật lúc " + LocalDateTime.now() +
                    " - Lý do: " + request.updateReason() + "]";
            receipt.setNotes(updatedNotes);
        }

        // 3. Save
        GoodsReceipt updated = goodsReceiptRepository.save(receipt);
        log.info("Goods receipt updated successfully: id={}", id);

        // 4. Return response (fetch with lines for complete data)
        return getGoodsReceiptById(id);
    }

    @Override
    public void deleteGoodsReceipt(Long id) {
        log.warn("Deleting goods receipt: id={}. This should be carefully controlled!", id);

        if (!goodsReceiptRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy phiếu nhập hàng ID: " + id);
        }

        // TODO: Should implement soft delete or prevent deletion after confirmation
        // TODO: Should reverse stock movements if deleting

        goodsReceiptRepository.deleteById(id);
        log.info("Goods receipt deleted: id={}", id);
    }

    // Helper methods

    /**
     * Calculate weighted average cost
     * Formula: (oldQty × oldCost + newQty × newCost) / (oldQty + newQty)
     */
    private BigDecimal calculateWeightedAverageCost(int oldQty, BigDecimal oldCost,
            int newQty, BigDecimal newCost) {
        if (oldQty + newQty == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal oldValue = oldCost.multiply(BigDecimal.valueOf(oldQty));
        BigDecimal newValue = newCost.multiply(BigDecimal.valueOf(newQty));
        BigDecimal totalValue = oldValue.add(newValue);
        BigDecimal totalQty = BigDecimal.valueOf(oldQty + newQty);

        return totalValue.divide(totalQty, 0, RoundingMode.HALF_UP);
    }

    private GoodsReceiptResponse mapToResponse(GoodsReceipt receipt) {
        SupplierResponse supplierResponse = new SupplierResponse(
                receipt.getSupplier().getSupplierId(),
                receipt.getSupplier().getName(),
                receipt.getSupplier().getContactEmail(),
                receipt.getSupplier().getContactPhone());

        List<GoodsReceiptResponse.GoodsReceiptLineDto> lineDtos = receipt.getLines().stream()
                .map(line -> {
                    BigDecimal lineTotal = line.getUnitCost()
                            .multiply(BigDecimal.valueOf(line.getQuantityReceived()));
                    return new GoodsReceiptResponse.GoodsReceiptLineDto(
                            line.getProduct().getProductId(),
                            line.getProduct().getProductName(),
                            line.getQuantityReceived(),
                            line.getUnitCost(),
                            lineTotal);
                })
                .collect(Collectors.toList());

        return new GoodsReceiptResponse(
                receipt.getReceiptId(),
                supplierResponse,
                receipt.getInvoiceNumber(),
                receipt.getTotalCost(),
                receipt.getNotes(),
                receipt.getReceiptDate(),
                lineDtos);
    }
}