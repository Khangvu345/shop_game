package com.gameshop.model.entity;

import com.gameshop.model.enums.StockMovementReason;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * StockMovement Entity - Tracking lịch sử thay đổi tồn kho
 */
@Entity
@Table(name = "stock_movement")
@Data
@NoArgsConstructor
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

    @Column(name = "order_id", length = 20)
    private String orderId; // Nếu liên quan đến đơn hàng
}