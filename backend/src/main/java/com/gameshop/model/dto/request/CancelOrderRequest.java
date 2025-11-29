package com.gameshop.model.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CancelOrderRequest(
        @NotBlank(message = "Cancellation reason is required") String reason,

        @NotBlank(message = "Cancelled by is required") String cancelledBy // Who is cancelling (customer/admin/system)
) {
}
