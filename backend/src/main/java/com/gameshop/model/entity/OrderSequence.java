package com.gameshop.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * OrderSequence Entity - Tracking daily order sequence numbers
 * Used to generate order IDs in format: DH{YYYYMMDD}{sequence}
 */
@Entity
@Table(name = "order_sequence")
@Data
@NoArgsConstructor
public class OrderSequence {

    @Id
    @Column(name = "sequence_date")
    private LocalDate sequenceDate;

    @Column(name = "last_sequence", nullable = false)
    private Integer lastSequence = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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
}
