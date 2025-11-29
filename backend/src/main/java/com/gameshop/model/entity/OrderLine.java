package com.gameshop.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * OrderLine Entity với Composite Primary Key (order_id, line_no)
 */
@Entity
@Table(name = "order_line")
@Data
@NoArgsConstructor
public class OrderLine {

    @EmbeddedId
    private OrderLinePK id;

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price_at_order", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "line_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;
}