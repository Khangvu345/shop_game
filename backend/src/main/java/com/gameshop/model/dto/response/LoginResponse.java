package com.gameshop.model.dto.response;

/**
 * DTO cho response đăng nhập thành công
 */
public record LoginResponse(
        String token,           // Simple token format: "userId-username-role"
        UserInfoResponse user   // Thông tin user
) {
}
