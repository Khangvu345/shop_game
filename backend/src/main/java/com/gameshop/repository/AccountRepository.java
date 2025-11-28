package com.gameshop.repository;

import com.gameshop.model.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho Account entity
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Tìm account theo username
     */
    Optional<Account> findByUsername(String username);

    /**
     * Tìm account theo email
     */
    Optional<Account> findByEmail(String email);

    /**
     * Kiểm tra username đã tồn tại chưa
     */
    boolean existsByUsername(String username);

    /**
     * Kiểm tra email đã tồn tại chưa
     */
    boolean existsByEmail(String email);
}
