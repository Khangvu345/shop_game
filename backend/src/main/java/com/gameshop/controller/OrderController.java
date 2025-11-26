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
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "APIs for managing orders with COD and VNPAY support")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create new order", description = "Create a new order with payment method selection (COD or VNPAY)")
    public ResponseEntity<CreateOrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        CreateOrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details", description = "Retrieve detailed information about a specific order")
    public ResponseEntity<OrderResponse> getOrderById(
            @Parameter(description = "Order ID") @PathVariable Long id) {
        OrderResponse response = orderService.getOrderResponse(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all orders (Admin)", description = "Retrieve all orders with optional filters and pagination")
    public ResponseEntity<OrderListResponse> getAllOrders(
            @Parameter(description = "Filter by order status") @RequestParam(required = false) OrderStatus status,

            @Parameter(description = "Filter by payment status") @RequestParam(required = false) PaymentStatus paymentStatus,

            @Parameter(description = "Filter by customer ID") @RequestParam(required = false) Long customerId,

            @Parameter(description = "Filter by start date (yyyy-MM-dd)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @Parameter(description = "Filter by end date (yyyy-MM-dd)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sortBy,

            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        OrderListResponse response = orderService.getAllOrders(
                status, paymentStatus, customerId, startDate, endDate, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get customer order history", description = "Retrieve order history for a specific customer")
    public ResponseEntity<OrderListResponse> getCustomerOrders(
            @Parameter(description = "Customer ID", required = true) @RequestParam Long customerId,

            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        OrderListResponse response = orderService.getCustomerOrders(customerId, pageable);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status", description = "Update the order status (validates workflow: PENDING → CONFIRMED → PREPARING → SHIPPED → DELIVERED → COMPLETED)")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @Parameter(description = "Order ID") @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/payment-status")
    @Operation(summary = "Update payment status", description = "Update payment status (for COD collection tracking or VNPAY payment confirmation)")
    public ResponseEntity<OrderResponse> updatePaymentStatus(
            @Parameter(description = "Order ID") @PathVariable Long id,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {

        OrderResponse response = orderService.updatePaymentStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel order", description = "Cancel an order and restore stock. Only PENDING or CONFIRMED orders can be cancelled.")
    public ResponseEntity<OrderResponse> cancelOrder(
            @Parameter(description = "Order ID") @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request) {

        OrderResponse response = orderService.cancelOrder(id, request);
        return ResponseEntity.ok(response);
    }
}