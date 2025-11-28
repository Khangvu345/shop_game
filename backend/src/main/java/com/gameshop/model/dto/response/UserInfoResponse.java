package com.gameshop.model.dto.response;

import com.gameshop.model.enums.Role;

/**
 * DTO chứa thông tin user (không bao gồm password)
 */
public record UserInfoResponse(
        Long userId,
        String username,
        String email,
        String fullName,
        Role role
) {
}
