package com.gameshop.model.enums;

public enum OrderStatus {
    PENDING, // Initial order state
    CONFIRMED, // Order confirmed
    PREPARING, // Order being prepared
    SHIPPED, // Order shipped to customer
    DELIVERED, // Order delivered successfully
    COMPLETED, // Order completed (COD payment collected)
    CANCELLED, // Order cancelled
    RETURNED // Order returned by customer
}