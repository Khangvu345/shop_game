package com.gameshop.model.enums;

public enum PaymentStatus {
    PENDING, // Awaiting payment (VNPAY)
    PAID, // Payment completed (VNPAY)
    COD_PENDING, // COD order, payment not yet collected
    COD_COLLECTED, // COD payment collected by shipper
    FAILED, // Payment failed
    REFUNDED // Payment refunded
}
