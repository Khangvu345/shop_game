package com.gameshop.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Composite Primary Key cho GoodsReceiptLine
 * Kết hợp receipt_id và line_no
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceiptLinePK implements Serializable {

    @Column(name = "receipt_id")
    private Long receiptId;

    @Column(name = "line_no")
    private Integer lineNo;
}