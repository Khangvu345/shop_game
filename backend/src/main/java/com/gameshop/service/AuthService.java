package com.gameshop.service;

import com.gameshop.model.dto.request.LoginRequest;
import com.gameshop.model.dto.request.RegisterRequest;
import com.gameshop.model.dto.response.LoginResponse;
import com.gameshop.model.dto.response.RegisterResponse;
import com.gameshop.model.dto.response.ValidateTokenResponse;

public interface AuthService {

    /**
     * Đăng nhập
     */
    LoginResponse login(LoginRequest request);

    /**
     * Đăng ký tài khoản mới (CUSTOMER)
     */
    RegisterResponse register(RegisterRequest request);

    /**
     * Đăng xuất
     */
    void logout(Long accountId);

    /**
     * Validate token (cho simple auth) và trả về thông tin người dùng
     */
    ValidateTokenResponse validateToken(String token);
}