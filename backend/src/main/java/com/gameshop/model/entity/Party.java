package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "party") // Tên bảng trong DB
@Inheritance(strategy = InheritanceType.JOINED) // Chiến lược kế thừa nối bảng
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Party {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "party_id") // QUAN TRỌNG: Map đúng tên cột khóa chính trong DB
    private Long id;

    @Column(name = "full_name") // Map với cột full_name
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone") // Map với cột phone
    private String phoneNumber;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Tự động lưu thời gian
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
