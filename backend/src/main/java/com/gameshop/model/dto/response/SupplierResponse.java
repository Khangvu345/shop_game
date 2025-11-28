package com.gameshop.model.dto.response;

/**
 * Response DTO cho Supplier
 */
public record SupplierResponse(
        Long supplierId,
        String name,
        String contactEmail,
        String contactPhone
) {}