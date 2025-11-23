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

    @Column(name = "list_price", nullable = false, precision = 10, scale = 0) // Mệnh giá VNĐ không có phần thập phân và tối đa 10 chữ số
    private BigDecimal listPrice;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

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






    // 1. Fix lỗi getStockQuantity()
    public Integer getStockQuantity() { 
        return stockQuantity; 
    }

    public void setStockQuantity(Integer stockQuantity) { 
        this.stockQuantity = stockQuantity; 
    }

    // 2. Fix lỗi getName() (Map sang productName)
    public String getName() { 
        return productName; 
    }
    
    // Getter chuẩn cho productName
    public String getProductName() { 
        return productName; 
    }

    public void setProductName(String productName) { 
        this.productName = productName; 
    }

    // 3. Fix lỗi getPrice() (Map sang listPrice)
    public java.math.BigDecimal getPrice() { 
        return listPrice; 
    }

    // Getter chuẩn cho listPrice
    public java.math.BigDecimal getListPrice() { 
        return listPrice; 
    }

    public void setListPrice(java.math.BigDecimal listPrice) { 
        this.listPrice = listPrice; 
    }




}