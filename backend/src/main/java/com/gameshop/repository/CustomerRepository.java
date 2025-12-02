package com.gameshop.repository;

import com.gameshop.model.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /**
     * Count new customers registered within a date range
     * 
     * @param startDate Start of the date range
     * @param endDate   End of the date range
     * @return Count of new customer registrations
     */
    @Query("SELECT COUNT(c) FROM Customer c " +
            "WHERE c.createdAt BETWEEN :startDate AND :endDate")
    Integer countNewCustomersByDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
