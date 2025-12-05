package com.gameshop.repository;

import com.gameshop.model.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Tìm account theo username
     */
    Optional<Account> findByUsername(String username);

    /**
     * Kiểm tra username đã tồn tại chưa
     */
    boolean existsByUsername(String username);

    /**
     * Tìm account với party (eager loading)
     */
    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.party WHERE a.username = :username")
    Optional<Account> findByUsernameWithParty(@Param("username") String username);

    /**
     * Tìm account với party theo ID (eager loading)
     */
    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.party WHERE a.accountId = :accountId")
    Optional<Account> findByIdWithParty(@Param("accountId") Long accountId);

    /**
     * Đếm số account theo role
     */
    long countByRole(Account.Role role);

    /**
     * Tìm account theo party ID
     */
    Optional<Account> findByPartyId(Long partyId);
}