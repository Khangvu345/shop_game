package com.gameshop.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * GoodsReceiptLine Entity - Chi tiết phiếu nhập hàng
 * Composite PK (receipt_id, line_no)
 */
@Entity
@Table(name = "goods_receipt_line")
@Data
@NoArgsConstructor
public class GoodsReceiptLine {

    @EmbeddedId
    private GoodsReceiptLinePK id;

    @ManyToOne
    @MapsId("receiptId")
    @JoinColumn(name = "receipt_id")
    @JsonIgnore
    private GoodsReceipt goodsReceipt;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(name = "quantity_received", nullable = false)
    private Integer quantityReceived;

    @Column(name = "unit_cost", precision = 12, scale = 2)
    private BigDecimal unitCost; // Giá nhập của đợt này
}