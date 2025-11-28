package com.gameshop.service.impl;

import com.gameshop.exception.BadRequestException;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.request.LoginRequest;
import com.gameshop.model.dto.request.RegisterRequest;
import com.gameshop.model.dto.response.LoginResponse;
import com.gameshop.model.dto.response.RegisterResponse;
import com.gameshop.model.dto.response.UserInfoResponse;
import com.gameshop.model.entity.User;
import com.gameshop.model.enums.Role;
import com.gameshop.repository.UserRepository;
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

    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt: username={}", request.username());

        // 1. Find user by username
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResourceNotFoundException("Tên đăng nhập hoặc mật khẩu không đúng"));

        // 2. Check password (plain text comparison - CHỈ TEST!)
        if (!user.getPassword().equals(request.password())) {
            log.warn("Login failed: incorrect password for username={}", request.username());
            throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        // 3. Check if user is active
        if (!user.getIsActive()) {
            log.warn("Login failed: account disabled for username={}", request.username());
            throw new BadRequestException("Tài khoản đã bị khóa. Vui lòng liên hệ admin.");
        }

        // 4. Generate simple token (userId-username-role)
        // Production: Dùng JWT với expiration, claims, signature
        String token = user.getUserId() + "-" + user.getUsername() + "-" + user.getRole();

        // 5. Map user info to response DTO
        UserInfoResponse userInfo = new UserInfoResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );

        log.info("Login successful: userId={}, username={}, role={}",
                user.getUserId(), user.getUsername(), user.getRole());

        return new LoginResponse(token, userInfo);
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        log.info("Registration attempt: username={}, email={}", request.username(), request.email());

        // 1. Validate username không trùng
        if (userRepository.existsByUsername(request.username())) {
            log.warn("Registration failed: username already exists - {}", request.username());
            throw new BadRequestException("Username '" + request.username() + "' đã tồn tại");
        }

        // 2. Validate email không trùng
        if (userRepository.existsByEmail(request.email())) {
            log.warn("Registration failed: email already exists - {}", request.email());
            throw new BadRequestException("Email '" + request.email() + "' đã được sử dụng");
        }

        // 3. Create new user (CUSTOMER role by default)
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(request.password());  // Plain text - CHỈ TEST! Production: BCrypt
        user.setEmail(request.email());
        user.setFullName(request.fullName());
        user.setRole(Role.CUSTOMER);  // Default role
        user.setIsActive(true);

        // 4. Save to database
        User savedUser = userRepository.save(user);

        log.info("Registration successful: userId={}, username={}, email={}",
                savedUser.getUserId(), savedUser.getUsername(), savedUser.getEmail());

        return new RegisterResponse(
                savedUser.getUserId(),
                savedUser.getUsername(),
                "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."
        );
    }
}
