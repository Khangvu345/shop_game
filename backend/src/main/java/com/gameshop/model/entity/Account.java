package com.gameshop.model.entity;

import com.gameshop.model.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity Account - Tài khoản người dùng (Admin hoặc Customer)
 *
 * WARNING: Password được lưu plain text - CHỈ ĐỂ TEST!
 * Production cần sử dụng BCrypt để hash password
 */
@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    /**
     * Password plain text - CHỈ ĐỂ TEST!
     * Production: Dùng BCrypt với @Column(nullable = false)
     */
    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Link to Customer entity (chỉ có khi role = CUSTOMER)
     * OneToOne bi-directional relationship
     */
    @OneToOne(mappedBy = "account")
    private Customer customer;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
