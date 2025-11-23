package com.gameshop.model.entity;

import jakarta.persistence.*;

@Entity // <--- BẮT BUỘC PHẢI CÓ CÁI NÀY
@Table(name = "order_address")
public class OrderAddress {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientName;
    private String phone; // Đặt tên là phone cho khớp với code Service lúc nãy
    
    private String street;
    private String city;
    private String ward;
    private String district;

    // --- CONSTRUCTOR ---
    public OrderAddress() {}

    public OrderAddress(String recipientName, String phone, String street, String city) {
        this.recipientName = recipientName;
        this.phone = phone;
        this.street = street;
        this.city = city;
    }

    // --- GETTER & SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
}