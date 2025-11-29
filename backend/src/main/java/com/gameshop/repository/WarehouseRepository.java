package com.gameshop.repository;

import com.gameshop.model.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho Warehouse - Quản lý kho
 */
@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    /**
     * Tìm warehouse theo tên
     */
    Optional<Warehouse> findByName(String name);

    /**
     * Kiểm tra warehouse tồn tại theo tên
     */
    boolean existsByName(String name);
}