package com.gameshop.repository;

import com.gameshop.model.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho Supplier - Nhà cung cấp
 */
@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    /**
     * Tìm supplier theo tên (không phân biệt hoa thường)
     */
    List<Supplier> findByNameContainingIgnoreCase(String name);

    /**
     * Tìm supplier theo email
     */
    Optional<Supplier> findByContactEmail(String email);

    /**
     * Tìm supplier theo số điện thoại
     */
    Optional<Supplier> findByContactPhone(String phone);

    /**
     * Kiểm tra supplier tồn tại theo tên
     */
    boolean existsByName(String name);

    /**
     * Kiểm tra supplier tồn tại theo email
     */
    boolean existsByContactEmail(String email);
}