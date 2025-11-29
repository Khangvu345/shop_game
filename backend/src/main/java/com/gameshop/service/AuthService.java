
package com.gameshop.service;

import com.gameshop.model.dto.request.LoginRequest;
import com.gameshop.model.dto.response.LoginResponse;

public interface AuthService {
    
    /**
     * Đăng nhập
     */
    LoginResponse login(LoginRequest request);
    
    /**
     * Đăng xuất
     */
    void logout(Long accountId);
    
    /**
     * Validate token (cho simple auth)
     */
    boolean validateToken(String token);
}