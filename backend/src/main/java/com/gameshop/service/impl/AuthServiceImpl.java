package com.gameshop.service.impl;

import com.gameshop.exception.BadRequestException;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.request.LoginRequest;
import com.gameshop.model.dto.request.RegisterRequest;
import com.gameshop.model.dto.response.AccountInfoResponse;
import com.gameshop.model.dto.response.LoginResponse;
import com.gameshop.model.dto.response.RegisterResponse;
import com.gameshop.model.entity.Account;
import com.gameshop.model.enums.Role;
import com.gameshop.repository.AccountRepository;
import com.gameshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation của AuthService
 *
 * WARNING: Password plain text comparison - CHỈ ĐỂ TEST!
 * Production cần BCrypt password encoder
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt: username={}", request.username());

        // 1. Find account by username
        Account account = accountRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResourceNotFoundException("Tên đăng nhập hoặc mật khẩu không đúng"));

        // 2. Check password (plain text comparison - CHỈ TEST!)
        if (!account.getPassword().equals(request.password())) {
            log.warn("Login failed: incorrect password for username={}", request.username());
            throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        // 3. Check if account is active
        if (!account.getIsActive()) {
            log.warn("Login failed: account disabled for username={}", request.username());
            throw new BadRequestException("Tài khoản đã bị khóa. Vui lòng liên hệ admin.");
        }

        // 4. Generate simple token (accountId-username-role)
        // Production: Dùng JWT với expiration, claims, signature
        String token = account.getAccountId() + "-" + account.getUsername() + "-" + account.getRole();

        // 5. Map account info to response DTO
        AccountInfoResponse accountInfo = new AccountInfoResponse(
                account.getAccountId(),
                account.getUsername(),
                account.getEmail(),
                account.getFullName(),
                account.getRole()
        );

        log.info("Login successful: accountId={}, username={}, role={}",
                account.getAccountId(), account.getUsername(), account.getRole());

        return new LoginResponse(token, accountInfo);
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        log.info("Registration attempt: username={}, email={}", request.username(), request.email());

        // 1. Validate username không trùng
        if (accountRepository.existsByUsername(request.username())) {
            log.warn("Registration failed: username already exists - {}", request.username());
            throw new BadRequestException("Username '" + request.username() + "' đã tồn tại");
        }

        // 2. Validate email không trùng
        if (accountRepository.existsByEmail(request.email())) {
            log.warn("Registration failed: email already exists - {}", request.email());
            throw new BadRequestException("Email '" + request.email() + "' đã được sử dụng");
        }

        // 3. Create new account (CUSTOMER role by default)
        Account account = new Account();
        account.setUsername(request.username());
        account.setPassword(request.password());  // Plain text - CHỈ TEST! Production: BCrypt
        account.setEmail(request.email());
        account.setFullName(request.fullName());
        account.setRole(Role.CUSTOMER);  // Default role
        account.setIsActive(true);

        // 4. Save to database
        Account savedAccount = accountRepository.save(account);

        log.info("Registration successful: accountId={}, username={}, email={}",
                savedAccount.getAccountId(), savedAccount.getUsername(), savedAccount.getEmail());

        return new RegisterResponse(
                savedAccount.getAccountId(),
                savedAccount.getUsername(),
                "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."
        );
    }
}
