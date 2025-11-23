package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer") // Tên bảng trong DB (số ít như ảnh bạn gửi)
@PrimaryKeyJoinColumn(name = "party_id") // Khóa ngoại nối với bảng Party
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends Party {

    @Column(name = "tier")
    private String tier;

    @Column(name = "points")
    private Integer points;
}