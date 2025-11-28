package com.gameshop.model.dto.response;

import com.gameshop.model.enums.Role;

/**
 * DTO chứa thông tin account (không bao gồm password)
 */
public record AccountInfoResponse(
        Long accountId,
        String username,
        String email,
        String fullName,
        Role role
) {
}
