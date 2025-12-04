package com.gameshop.model.dto.response;

public record RegisterResponse(
        Long accountId,
        String username,
        Long partyId,
        String fullName,
        String email,
        String role) {
}
