package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Supplier Entity - Nhà cung cấp
 */
@Entity
@Table(name = "supplier")
@Data
@NoArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;
}