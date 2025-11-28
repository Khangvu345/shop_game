package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.request.LoginRequest;
import com.gameshop.model.dto.request.RegisterRequest;
import com.gameshop.model.dto.response.LoginResponse;
import com.gameshop.model.dto.response.RegisterResponse;
import com.gameshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý Authentication
 * Endpoints: /api/v1/auth/*
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs xác thực người dùng (đăng nhập, đăng ký)")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "Đăng nhập",
            description = "Đăng nhập bằng username và password. Trả về token và thông tin user."
    )
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("Đăng nhập thành công", response)
        );
    }

    @PostMapping("/register")
    @Operation(
            summary = "Đăng ký tài khoản",
            description = "Đăng ký tài khoản khách hàng mới (role = CUSTOMER). " +
                    "Username và email phải unique. Password tối thiểu 6 ký tự."
    )
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Đăng ký thành công", response)
        );
    }
}
