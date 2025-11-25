package com.gameshop.controller;

import com.gameshop.model.dto.common.CreateOrderRequest;
import com.gameshop.model.dto.common.CreateOrderResponse;
import com.gameshop.model.entity.Order; 
import com.gameshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<CreateOrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        CreateOrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    // 2. Sửa kiểu trả về thành ResponseEntity<Order>
    public ResponseEntity<Order> getDetailOrder(@PathVariable Long id) {
        
        // 3. Gọi Service để lấy dữ liệu từ Database
        Order order = orderService.getOrderDetail(id);
        
        // 4. Trả về đối tượng Order đầy đủ
        return ResponseEntity.ok(order);
    }
}