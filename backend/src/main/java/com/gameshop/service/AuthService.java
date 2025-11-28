package com.gameshop.service;

import com.gameshop.model.dto.request.LoginRequest;
import com.gameshop.model.dto.request.RegisterRequest;
import com.gameshop.model.dto.response.LoginResponse;
import com.gameshop.model.dto.response.RegisterResponse;

/**
 * Service interface cho Authentication
 */
public interface AuthService {

    /**
     * Đăng nhập
     * @param request Login credentials
     * @return LoginResponse với token và thông tin user
     */
    LoginResponse login(LoginRequest request);

    /**
     * Đăng ký tài khoản mới (CUSTOMER role)
     * @param request Registration info
     * @return RegisterResponse với thông tin user mới
     */
    RegisterResponse register(RegisterRequest request);
}
