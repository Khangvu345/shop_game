package com.gameshop.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Health Check", description = "Kiểm tra trạng thái API")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Health Check", description = "Kiểm tra xem API có đang hoạt động không")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "GameShop API is running successfully!");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    @Operation(summary = "API Information", description = "Lấy thông tin chi tiết về API")
    public ResponseEntity<Map<String, Object>> apiInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "GameShop API");
        info.put("version", "1.0.0");
        info.put("description", "Backend API cho hệ thống quản lý cửa hàng GameShop");
        info.put("documentation", "/swagger-ui/index.html");
        
        Map<String, String> features = new HashMap<>();
        features.put("products", "Quản lý sản phẩm");
        features.put("customers", "Quản lý khách hàng");
        features.put("orders", "Quản lý đơn hàng");
        features.put("inventory", "Quản lý kho");
        
        info.put("features", features);
        
        return ResponseEntity.ok(info);
    }
}