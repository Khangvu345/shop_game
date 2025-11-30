package com.gameshop.model.dto.response;

public record LoginResponse(
    Long accountId,
    String username,
    Long partyId,
    String fullName,
    String role, // "ADMIN" hoặc "CUSTOMER"
    String token  // Token đơn giản test
) {
}
