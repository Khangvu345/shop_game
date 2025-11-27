package com.gameshop.model.entity;

import jakarta.persistence.*;

/**
 * OrderAddress Entity với Shared Primary Key (order_id)
 * PK = FK đến bảng order (1-1 relationship)
 */
@Entity
@Table(name = "order_address")
public class OrderAddress {

    @Id
    @Column(name = "order_id")
    private Long id; // Shared PK với Order

    @OneToOne
    @MapsId
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "receiver_name", length = 150, nullable = false)
    private String receiverName;

    @Column(name = "receiver_phone", length = 30, nullable = false)
    private String receiverPhone;

    @Column(name = "line1", length = 200, nullable = false)
    private String line1; // Địa chỉ chi tiết

    @Column(name = "line2", length = 200)
    private String line2; // Địa chỉ bổ sung (optional)

    @Column(length = 100)
    private String district;

    @Column(length = 100, nullable = false)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    // --- CONSTRUCTORS ---
    public OrderAddress() {}

    public OrderAddress(String receiverName, String receiverPhone, String line1, String city) {
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.line1 = line1;
        this.city = city;
    }

    // --- GETTERS & SETTERS ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getLine1() {
        return line1;
    }

    public void setLine1(String line1) {
        this.line1 = line1;
    }

    public String getLine2() {
        return line2;
    }

    public void setLine2(String line2) {
        this.line2 = line2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    // Backward compatibility methods (để code cũ không bị lỗi)
    public String getRecipientName() {
        return receiverName;
    }

    public void setRecipientName(String recipientName) {
        this.receiverName = recipientName;
    }

    public String getPhone() {
        return receiverPhone;
    }

    public void setPhone(String phone) {
        this.receiverPhone = phone;
    }

    public String getStreet() {
        return line1;
    }

    public void setStreet(String street) {
        this.line1 = street;
    }
}
