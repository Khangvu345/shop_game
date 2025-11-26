package com.gameshop.validator;

import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentMethod;
import com.gameshop.model.enums.PaymentStatus;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;

@Component
public class OrderStatusValidator {

    // State machine: định nghĩa các transition hợp lệ
    private static final Map<OrderStatus, EnumSet<OrderStatus>> ALLOWED_TRANSITIONS;

    static {
        ALLOWED_TRANSITIONS = new EnumMap<>(OrderStatus.class);

        // PENDING có thể chuyển sang CONFIRMED hoặc CANCELLED
        ALLOWED_TRANSITIONS.put(OrderStatus.PENDING,
                EnumSet.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED));

        // CONFIRMED có thể chuyển sang PREPARING hoặc CANCELLED
        ALLOWED_TRANSITIONS.put(OrderStatus.CONFIRMED,
                EnumSet.of(OrderStatus.PREPARING, OrderStatus.CANCELLED));

        // PREPARING có thể chuyển sang SHIPPED hoặc CANCELLED
        ALLOWED_TRANSITIONS.put(OrderStatus.PREPARING,
                EnumSet.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED));

        // SHIPPED có thể chuyển sang DELIVERED (không thể cancel khi đã ship)
        ALLOWED_TRANSITIONS.put(OrderStatus.SHIPPED,
                EnumSet.of(OrderStatus.DELIVERED));

        // DELIVERED có thể chuyển sang COMPLETED hoặc RETURNED
        ALLOWED_TRANSITIONS.put(OrderStatus.DELIVERED,
                EnumSet.of(OrderStatus.COMPLETED, OrderStatus.RETURNED));

        // COMPLETED, CANCELLED, RETURNED là terminal states - không chuyển được nữa
        ALLOWED_TRANSITIONS.put(OrderStatus.COMPLETED, EnumSet.noneOf(OrderStatus.class));
        ALLOWED_TRANSITIONS.put(OrderStatus.CANCELLED, EnumSet.noneOf(OrderStatus.class));
        ALLOWED_TRANSITIONS.put(OrderStatus.RETURNED, EnumSet.noneOf(OrderStatus.class));
    }

    /**
     * Kiểm tra xem có được phép chuyển từ currentStatus sang newStatus không
     */
    public boolean isValidTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == null || newStatus == null) {
            return false;
        }

        EnumSet<OrderStatus> allowedStatuses = ALLOWED_TRANSITIONS.get(currentStatus);
        return allowedStatuses != null && allowedStatuses.contains(newStatus);
    }

    /**
     * Validate workflow cho VNPay: phải PAID trước mới được CONFIRMED
     */
    public boolean canConfirmOrder(PaymentMethod paymentMethod, PaymentStatus paymentStatus) {
        if (paymentMethod == PaymentMethod.VNPAY) {
            // VNPay phải thanh toán trước
            return paymentStatus == PaymentStatus.PAID;
        }
        // COD không yêu cầu thanh toán trước
        return true;
    }

    /**
     * Kiểm tra xem order có thể bị cancel không
     * Không thể cancel khi đã SHIPPED, DELIVERED, hoặc COMPLETED
     */
    public boolean canCancelOrder(OrderStatus currentStatus) {
        return currentStatus != OrderStatus.SHIPPED
                && currentStatus != OrderStatus.DELIVERED
                && currentStatus != OrderStatus.COMPLETED
                && currentStatus != OrderStatus.CANCELLED
                && currentStatus != OrderStatus.RETURNED;
    }

    /**
     * Lấy error message khi transition không hợp lệ
     */
    public String getInvalidTransitionMessage(OrderStatus from, OrderStatus to) {
        return String.format(
                "Không thể chuyển trạng thái đơn hàng từ %s sang %s",
                from, to);
    }
}
