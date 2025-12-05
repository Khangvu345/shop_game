package com.gameshop.model.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Response DTO cho địa chỉ
 */
@Schema(description = "Address response")
public record AddressResponse(
        @Schema(description = "Address ID", example = "1") Long id,

        @Schema(description = "Street address", example = "123 Nguyen Hue") String line1,

        @Schema(description = "Additional address line", example = "Apartment 5B") String line2,

        @Schema(description = "Ward", example = "Phuong Ben Nghe") String ward,

        @Schema(description = "City", example = "Ho Chi Minh") String city,

        @Schema(description = "Postal code", example = "700000") String postalCode,

        @Schema(description = "Is default address", example = "true") Boolean isDefault) {
}
