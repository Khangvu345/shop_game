package com.gameshop.model.dto.response;

public record ValidateTokenResponse(
        boolean isValid,
        Long accountId,
        String username,
        Long partyId,
        String fullName,
        String role // "ADMIN" hoặc "USER"
) {
}
