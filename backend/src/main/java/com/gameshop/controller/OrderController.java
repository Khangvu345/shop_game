package com.gameshop.controller;

import com.gameshop.model.dto.common.CreateOrderRequest;
import com.gameshop.model.dto.common.CreateOrderResponse;
import com.gameshop.model.dto.request.CancelOrderRequest;
import com.gameshop.model.dto.request.UpdateOrderStatusRequest;
import com.gameshop.model.dto.request.UpdatePaymentStatusRequest;
import com.gameshop.model.dto.response.OrderListResponse;
import com.gameshop.model.dto.response.OrderResponse;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentStatus;
import com.gameshop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "APIs for managing orders with COD and VNPay support")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create new order", description = "Create a new order with COD or VNPay payment method")
    public ResponseEntity<CreateOrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Principal principal) {
        CreateOrderResponse response = orderService.createOrder(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all orders (Admin)", description = "List all orders with optional filters and pagination")
    public ResponseEntity<OrderListResponse> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy) {
        OrderListResponse response = orderService.getAllOrders(
                status, paymentStatus, customerId, fromDate, toDate, page, size, sortBy);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get customer orders", description = "Get order history for a specific customer")
    public ResponseEntity<OrderListResponse> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        OrderListResponse response = orderService.getMyOrders(principal.getName(), page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details", description = "Get detailed information about a specific order")
    public ResponseEntity<OrderResponse> getOrderDetail(
            @PathVariable Long id,
            Principal principal) {
        OrderResponse response = orderService.getOrderDetail(id, principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status", description = "Update order status with workflow validation")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/payment-status")
    @Operation(summary = "Update payment status", description = "Update payment status (e.g., mark COD as collected)")
    public ResponseEntity<OrderResponse> updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {
        OrderResponse response = orderService.updatePaymentStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel order", description = "Cancel order and restore stock automatically")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request,
            Principal principal) {
        OrderResponse response = orderService.cancelOrder(id, request, principal.getName());
        return ResponseEntity.ok(response);
    }
}