package com.gameshop.repository;

import com.gameshop.model.entity.OrderSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Repository for OrderSequence entity
 * Handles daily sequence tracking for order ID generation
 */
@Repository
public interface OrderSequenceRepository extends JpaRepository<OrderSequence, LocalDate> {

    /**
     * Find sequence for a specific date with pessimistic write lock
     * This ensures thread-safe sequence generation
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT os FROM OrderSequence os WHERE os.sequenceDate = :date")
    Optional<OrderSequence> findByDateForUpdate(@Param("date") LocalDate date);
}
