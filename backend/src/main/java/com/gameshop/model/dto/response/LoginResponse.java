package com.gameshop.model.dto.response;

/**
 * DTO cho response đăng nhập thành công
 */
public record LoginResponse(
        String token,                    // Simple token format: "accountId-username-role"
        AccountInfoResponse account      // Thông tin account
) {
}
