package com.gameshop.repository;

import com.gameshop.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Hiện tại để trống, sau này thêm các hàm tìm kiếm sau
}
