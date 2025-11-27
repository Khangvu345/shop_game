package com.gameshop.model.entity;

import jakarta.persistence.*;

/**
 * Warehouse Entity - Quản lý kho
 * Hiện tại chỉ có 1 kho mặc định (warehouse_id = 1)
 */
@Entity
@Table(name = "warehouse")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(name = "address_text", length = 255)
    private String addressText;

    // --- CONSTRUCTORS ---
    public Warehouse() {
    }

    public Warehouse(String name, String addressText) {
        this.name = name;
        this.addressText = addressText;
    }

    // --- GETTERS & SETTERS ---
    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddressText() {
        return addressText;
    }

    public void setAddressText(String addressText) {
        this.addressText = addressText;
    }
}