package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false, length = 120)
    private String categoryName;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Tự liên kết (Cha - Con)
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;
}