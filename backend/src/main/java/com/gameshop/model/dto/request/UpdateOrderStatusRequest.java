package com.gameshop.model.dto.request;

import com.gameshop.model.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Status is required") OrderStatus status,

        String note // Optional admin note
) {
}
