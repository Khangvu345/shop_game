package com.gameshop.repository;

import com.gameshop.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for Address entity
 */
public interface AddressRepository extends JpaRepository<Address, Long> {
    
    /**
     * Tìm địa chỉ mặc định của khách hàng
     * @param partyId ID của customer (party_id)
     * @return Địa chỉ mặc định nếu có
     */
    Optional<Address> findByPartyIdAndIsDefaultTrue(Long partyId);
}
