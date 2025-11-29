package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Warehouse Entity - Quản lý kho
 * Hiện tại chỉ có 1 kho mặc định (warehouse_id = 1)
 */
@Entity
@Table(name = "warehouse")
@Data
@NoArgsConstructor
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(name = "address_text", length = 255)
    private String addressText;
}