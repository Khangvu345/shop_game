package com.gameshop.model.entity;

import com.gameshop.model.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "sku", unique = true, length = 100)
    private String sku;

    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "list_price", nullable = false, precision = 10, scale = 0) // Mệnh giá VNĐ không có phần thập phân và
                                                                              // tối đa 10 chữ số
    private BigDecimal listPrice;

    @Column(name = "purchase_price", precision = 10, scale = 0)
    private BigDecimal purchasePrice = BigDecimal.ZERO; // Giá vốn bình quân gia quyền

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0; // Tồn kho hiện tại

    @Column(name = "status", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.Active; // Viết thường để đồng bộ với cơ sở dữ liệu

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Backward compatibility alias methods
    public Long getId() {
        return productId;
    }

    public String getName() {
        return productName;
    }

    public BigDecimal getPrice() {
        return listPrice;
    }
}