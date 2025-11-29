package com.gameshop.model.enums;

public enum PaymentStatus {
    PENDING, // Payment pending (VNPay orders)
    PAID, // Payment completed (VNPay orders)
    COD_PENDING, // COD payment pending collection
    COD_COLLECTED, // COD payment collected by shipper
    FAILED, // Payment failed
    REFUNDED // Payment refunded
}
