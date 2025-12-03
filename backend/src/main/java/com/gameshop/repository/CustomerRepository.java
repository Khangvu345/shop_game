package com.gameshop.repository;

import com.gameshop.model.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /**
     * Tìm kiếm khách hàng theo tên, email hoặc số điện thoại
     * 
     * @param keyword  Từ khóa tìm kiếm
     * @param pageable Phân trang
     * @return Danh sách khách hàng phân trang
     */
    @Query("SELECT c FROM Customer c WHERE " +
            "LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Customer> searchCustomers(@Param("keyword") String keyword, Pageable pageable);
}
