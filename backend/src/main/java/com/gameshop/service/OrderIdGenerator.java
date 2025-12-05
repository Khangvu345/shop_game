package com.gameshop.service;

import com.gameshop.model.entity.OrderSequence;
import com.gameshop.repository.OrderSequenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Service for generating unique order IDs
 * Format: DH{YYYYMMDD}{sequence}
 * Example: DH20251205001, DH20251205002, etc.
 */
@Service
@Transactional
public class OrderIdGenerator {

    private final OrderSequenceRepository sequenceRepo;

    @Autowired
    public OrderIdGenerator(OrderSequenceRepository sequenceRepo) {
        this.sequenceRepo = sequenceRepo;
    }

    /**
     * Generate a new order ID for today
     * Thread-safe using pessimistic locking
     *
     * @return Order ID in format DH{YYYYMMDD}{sequence}
     */
    public synchronized String generateOrderId() {
        LocalDate today = LocalDate.now();

        // Get or create sequence for today with pessimistic lock
        OrderSequence sequence = sequenceRepo.findByDateForUpdate(today)
                .orElseGet(() -> {
                    OrderSequence newSeq = new OrderSequence();
                    newSeq.setSequenceDate(today);
                    newSeq.setLastSequence(0);
                    newSeq.setCreatedAt(LocalDateTime.now());
                    newSeq.setUpdatedAt(LocalDateTime.now());
                    return sequenceRepo.save(newSeq);
                });

        // Increment sequence
        int nextSequence = sequence.getLastSequence() + 1;
        sequence.setLastSequence(nextSequence);
        sequence.setUpdatedAt(LocalDateTime.now());
        sequenceRepo.save(sequence);

        // Format: DH + YYYYMMDD + sequence (3 digits, zero-padded)
        String dateStr = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String seqStr = String.format("%03d", nextSequence);

        return "DH" + dateStr + seqStr;
    }
}
