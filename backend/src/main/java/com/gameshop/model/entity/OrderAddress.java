package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OrderAddress Entity với Shared Primary Key (order_id)
 * PK = FK đến bảng order (1-1 relationship)
 */
@Entity
@Table(name = "order_address")
@Data
@NoArgsConstructor
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

    // Backward compatibility constructor
    public OrderAddress(String receiverName, String receiverPhone, String line1, String city) {
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.line1 = line1;
        this.city = city;
    }

    // Backward compatibility methods
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