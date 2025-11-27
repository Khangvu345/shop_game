package com.gameshop.model.entity;

import com.gameshop.model.enums.StockMovementReason;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * StockMovement Entity - Tracking lịch sử thay đổi tồn kho
 */
@Entity
@Table(name = "stock_movement")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movement_id")
    private Long movementId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(name = "quantity_delta", nullable = false)
    private Integer quantityDelta; // Số lượng thay đổi (+100, -10, etc.)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StockMovementReason reason;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    @Column(name = "reference_no", length = 120)
    private String referenceNo; // Số tham chiếu (VD: INV-001, ORDER-123)

    @Column(name = "order_id")
    private Long orderId; // Nếu liên quan đến đơn hàng

    // --- CONSTRUCTORS ---
    public StockMovement() {
    }

    // --- GETTERS & SETTERS ---
    public Long getMovementId() {
        return movementId;
    }

    public void setMovementId(Long movementId) {
        this.movementId = movementId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Warehouse getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }

    public Integer getQuantityDelta() {
        return quantityDelta;
    }

    public void setQuantityDelta(Integer quantityDelta) {
        this.quantityDelta = quantityDelta;
    }

    public StockMovementReason getReason() {
        return reason;
    }

    public void setReason(StockMovementReason reason) {
        this.reason = reason;
    }

    public LocalDateTime getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(LocalDateTime occurredAt) {
        this.occurredAt = occurredAt;
    }

    public String getReferenceNo() {
        return referenceNo;
    }

    public void setReferenceNo(String referenceNo) {
        this.referenceNo = referenceNo;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}