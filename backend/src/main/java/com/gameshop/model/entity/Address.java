package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Address Entity - Địa chỉ khách hàng
 * Map với bảng address có sẵn trong database
 * LƯU Ý: Không map trường district như yêu cầu
 */
@Entity
@Table(name = "address")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long id;

    @Column(name = "party_id", nullable = false)
    private Long partyId;

    @Column(name = "line1", length = 255)
    private String line1;

    @Column(name = "line2", length = 255)
    private String line2;

    @Column(name = "ward", length = 100)
    private String ward;

    // LƯU Ý: Không map trường district theo yêu cầu
    // @Column(name = "district", length = 100)
    // private String district;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "is_default")
    private Boolean isDefault = false;
}
