package com.gameshop.repository;

import com.gameshop.model.entity.GoodsReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository cho GoodsReceipt - Phiếu nhập hàng
 */
@Repository
public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, Long> {

    /**
     * Tìm goods receipt theo invoice number
     */
    Optional<GoodsReceipt> findByInvoiceNumber(String invoiceNumber);

    /**
     * Tìm tất cả goods receipts của một supplier
     */
    List<GoodsReceipt> findBySupplier_SupplierIdOrderByReceiptDateDesc(Long supplierId);

    /**
     * Tìm goods receipts trong khoảng thời gian
     */
    List<GoodsReceipt> findByReceiptDateBetweenOrderByReceiptDateDesc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    /**
     * Tìm goods receipts theo supplier và thời gian
     */
    List<GoodsReceipt> findBySupplier_SupplierIdAndReceiptDateBetweenOrderByReceiptDateDesc(
            Long supplierId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    /**
     * Đếm số phiếu nhập của một supplier
     */
    long countBySupplier_SupplierId(Long supplierId);

    /**
     * Kiểm tra invoice number đã tồn tại chưa
     */
    boolean existsByInvoiceNumber(String invoiceNumber);

    /**
     * Lấy tất cả goods receipts với lines (eager loading)
     */
    @Query("SELECT DISTINCT gr FROM GoodsReceipt gr LEFT JOIN FETCH gr.lines WHERE gr.receiptId = :receiptId")
    Optional<GoodsReceipt> findByIdWithLines(@Param("receiptId") Long receiptId);
}