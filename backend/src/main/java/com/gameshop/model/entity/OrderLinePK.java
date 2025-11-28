package com.gameshop.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Composite Primary Key cho OrderLine
 * Kết hợp order_id và line_no
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderLinePK implements Serializable {

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "line_no")
    private Integer lineNo;
}