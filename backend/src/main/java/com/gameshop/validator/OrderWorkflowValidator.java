package com.gameshop.validator;

import com.gameshop.model.entity.Order;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentMethod;
import com.gameshop.model.enums.PaymentStatus;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Set;

@Component
public class OrderWorkflowValidator {

    // Valid transitions for order status
    private static final Set<OrderStatus> CANCELLABLE_STATUSES = EnumSet.of(OrderStatus.PENDING, OrderStatus.CONFIRMED);

    /**
     * Validates if an order status transition is allowed
     */
    public void validateOrderStatusTransition(OrderStatus from, OrderStatus to,
            PaymentMethod paymentMethod,
            PaymentStatus paymentStatus) {
        // Cannot transition from null or to null
        if (from == null || to == null) {
            throw new IllegalStateException("Order status cannot be null");
        }

        // Cannot transition from cancelled or returned
        if (from == OrderStatus.CANCELLED || from == OrderStatus.RETURNED) {
            throw new IllegalStateException("Cannot change status of cancelled or returned orders");
        }

        // Cannot transition to same status
        if (from == to) {
            return; // No change needed
        }

        // For VNPAY, must be PAID before moving to CONFIRMED or beyond
        if (paymentMethod == PaymentMethod.VNPAY) {
            if (from == OrderStatus.PENDING && (to == OrderStatus.CONFIRMED ||
                    to == OrderStatus.PREPARING || to == OrderStatus.SHIPPED ||
                    to == OrderStatus.DELIVERED)) {
                if (paymentStatus != PaymentStatus.PAID) {
                    throw new IllegalStateException(
                            "VNPAY orders must be PAID before they can be confirmed or shipped");
                }
            }
        }

        // Validate logical progression
        validateLogicalProgression(from, to);
    }

    /**
     * Validates logical order progression
     */
    private void validateLogicalProgression(OrderStatus from, OrderStatus to) {
        // Define valid next statuses for each current status
        boolean isValid = switch (from) {
            case PENDING -> to == OrderStatus.CONFIRMED || to == OrderStatus.CANCELLED;
            case CONFIRMED -> to == OrderStatus.PREPARING || to == OrderStatus.CANCELLED;
            case PREPARING -> to == OrderStatus.SHIPPED;
            case SHIPPED -> to == OrderStatus.DELIVERED || to == OrderStatus.RETURNED;
            case DELIVERED -> to == OrderStatus.COMPLETED || to == OrderStatus.RETURNED;
            case COMPLETED -> false; // Cannot change from completed
            case CANCELLED -> false; // Cannot change from cancelled
            case RETURNED -> false; // Cannot change from returned
        };

        if (!isValid) {
            throw new IllegalStateException(
                    String.format("Invalid order status transition from %s to %s", from, to));
        }
    }

    /**
     * Validates if an order can be cancelled
     */
    public void validateCancellation(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }

        OrderStatus status = order.getStatus();
        if (!CANCELLABLE_STATUSES.contains(status)) {
            throw new IllegalStateException(
                    String.format("Orders with status %s cannot be cancelled. " +
                            "Only PENDING or CONFIRMED orders can be cancelled.", status));
        }
    }

    /**
     * Validates payment status transition
     */
    public void validatePaymentStatusTransition(PaymentStatus from, PaymentStatus to) {
        if (from == null || to == null) {
            throw new IllegalStateException("Payment status cannot be null");
        }

        // Cannot transition to same status
        if (from == to) {
            return;
        }

        // Define valid transitions
        boolean isValid = switch (from) {
            case PENDING -> to == PaymentStatus.PAID || to == PaymentStatus.FAILED;
            case COD_PENDING -> to == PaymentStatus.COD_COLLECTED || to == PaymentStatus.FAILED;
            case PAID -> to == PaymentStatus.REFUNDED;
            case COD_COLLECTED -> to == PaymentStatus.REFUNDED;
            case FAILED -> to == PaymentStatus.PENDING || to == PaymentStatus.COD_PENDING;
            case REFUNDED -> false; // Cannot change from refunded
        };

        if (!isValid) {
            throw new IllegalStateException(
                    String.format("Invalid payment status transition from %s to %s", from, to));
        }
    }
}
