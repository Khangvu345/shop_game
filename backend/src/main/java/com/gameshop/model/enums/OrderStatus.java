package com.gameshop.model.enums;

public enum OrderStatus {
    PENDING, // Order created, awaiting confirmation
    CONFIRMED, // Order confirmed, ready for preparation
    PREPARING, // Order being prepared/packed
    SHIPPED, // Order shipped to customer
    DELIVERED, // Order delivered to customer
    COMPLETED, // Order completed successfully
    CANCELLED, // Order cancelled
    RETURNED // Order returned by customer
}