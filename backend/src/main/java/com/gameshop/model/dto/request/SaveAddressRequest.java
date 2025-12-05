package com.gameshop.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO để lưu địa chỉ mặc định
 */
@Schema(description = "Save default address request")
public record SaveAddressRequest(
        @Schema(description = "Street address (required)", example = "123 Nguyen Hue") @NotBlank(message = "Street address (line1) is required") String line1,

        @Schema(description = "Additional address line", example = "Apartment 5B") String line2,

        @Schema(description = "Ward", example = "Phuong Ben Nghe") String ward,

        @Schema(description = "City (required)", example = "Ho Chi Minh") @NotBlank(message = "City is required") String city,

        @Schema(description = "Postal code", example = "700000") String postalCode) {
}
