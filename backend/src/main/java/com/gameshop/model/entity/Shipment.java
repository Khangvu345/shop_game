package com.gameshop.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.gameshop.model.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Formula; // QUAN TRỌNG: thêm import này

@Entity
@Table(name = "shipment")
@Data
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipment_id")
    private Long shipmentId;

    @Column(name = "order_id", nullable = false, updatable = false)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    private Order order;

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    @Column(length = 100)
    private String carrier;

    @Column(name = "tracking_no", length = 120)
    private String trackingNo;

    @Column(name = "estimated_delivery")
    private LocalDate estimatedDelivery; // nên đổi thành LocalDate, nhưng tạm để sau

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status;
}