package com.gameshop.service.impl;

import com.gameshop.exception.BadRequestException;
import com.gameshop.model.dto.request.LoginRequest;
import com.gameshop.model.dto.response.LoginResponse;
import com.gameshop.model.dto.response.ValidateTokenResponse;
import com.gameshop.model.entity.Account;
import com.gameshop.model.entity.Party;
import com.gameshop.repository.AccountRepository;
import com.gameshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for username: {}", request.username());

        // 1. Tìm account với party
        Account account = accountRepository.findByUsernameWithParty(request.username())
                .orElseThrow(() -> new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng"));

        // 2. Kiểm tra account status
        if (account.getAccountStatus() != Account.AccountStatus.Active) {
            throw new BadRequestException("Tài khoản đã bị khóa hoặc tạm ngưng");
        }

        // 3. Kiểm tra password
        if (!account.getPassword().equals(request.password())) {
            throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        // 4. Cập nhật last login time
        account.setLastLoginAt(LocalDateTime.now());
        accountRepository.save(account);

        // 5. Get party info
        Party party = account.getParty();

        // 6. Generate simple token
        String token = generateSimpleToken(account.getAccountId(), account.getRole().name());

        log.info("Login successful - username: {}, role: {}",
                request.username(), account.getRole());

        // 7. Return response
        return new LoginResponse(
                account.getAccountId(),
                account.getUsername(),
                party.getId(),
                party.getFullName(),
                account.getRole().name(),
                token);
    }

    @Override
    public void logout(Long accountId) {
        log.info("Logout for accountId: {}", accountId);

        // Validate account exists
        accountRepository.findById(accountId)
                .orElseThrow(() -> new BadRequestException("Account không tồn tại"));

        // Trong simple implementation, frontend sẽ clear token
        // Production có thể invalidate JWT token ở backend
    }

    @Override
    public ValidateTokenResponse validateToken(String token) {
        if (token == null || token.isBlank()) {
            return new ValidateTokenResponse(false, null, null, null, null, null);
        }

        try {
            // Parse simple token format: "accountId:role:timestamp"
            String[] parts = token.split(":");
            if (parts.length != 3) {
                return new ValidateTokenResponse(false, null, null, null, null, null);
            }

            // Kiểm tra timestamp (token valid trong 24h)
            long timestamp = Long.parseLong(parts[2]);
            long now = System.currentTimeMillis();
            long dayInMillis = 24 * 60 * 60 * 1000;

            if ((now - timestamp) >= dayInMillis) {
                return new ValidateTokenResponse(false, null, null, null, null, null);
            }

            // Token hợp lệ, lấy thông tin account
            Long accountId = Long.parseLong(parts[0]);
            Account account = accountRepository.findByIdWithParty(accountId)
                    .orElse(null);

            if (account == null || account.getAccountStatus() != Account.AccountStatus.Active) {
                return new ValidateTokenResponse(false, null, null, null, null, null);
            }

            Party party = account.getParty();

            return new ValidateTokenResponse(
                    true,
                    account.getAccountId(),
                    account.getUsername(),
                    party.getId(),
                    party.getFullName(),
                    account.getRole().name());

        } catch (Exception e) {
            log.error("Error validating token", e);
            return new ValidateTokenResponse(false, null, null, null, null, null);
        }
    }

    /**
     * Generate simple token
     * Format: "accountId:role:timestamp"
     * 
     */
    private String generateSimpleToken(Long accountId, String role) {
        return String.format("%d:%s:%d",
                accountId,
                role,
                System.currentTimeMillis());
    }
}
