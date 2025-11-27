package com.gameshop.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * GoodsReceiptLine Entity - Chi tiết phiếu nhập hàng
 * Composite PK (receipt_id, line_no)
 */
@Entity
@Table(name = "goods_receipt_line")
public class GoodsReceiptLine {

    @Id
    @ManyToOne
    @JoinColumn(name = "receipt_id", nullable = false)
    private GoodsReceipt goodsReceipt;

    @Id
    @Column(name = "line_no", nullable = false)
    private Integer lineNo;

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

    // --- CONSTRUCTORS ---
    public GoodsReceiptLine() {
    }

    // --- GETTERS & SETTERS ---
    public GoodsReceipt getGoodsReceipt() {
        return goodsReceipt;
    }

    public void setGoodsReceipt(GoodsReceipt goodsReceipt) {
        this.goodsReceipt = goodsReceipt;
    }

    public Integer getLineNo() {
        return lineNo;
    }

    public void setLineNo(Integer lineNo) {
        this.lineNo = lineNo;
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

    public Integer getQuantityReceived() {
        return quantityReceived;
    }

    public void setQuantityReceived(Integer quantityReceived) {
        this.quantityReceived = quantityReceived;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }
}