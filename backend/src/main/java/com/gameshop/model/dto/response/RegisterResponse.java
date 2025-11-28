package com.gameshop.model.dto.response;

/**
 * DTO cho response đăng ký thành công
 */
public record RegisterResponse(
        Long accountId,
        String username,
        String message
) {
}
