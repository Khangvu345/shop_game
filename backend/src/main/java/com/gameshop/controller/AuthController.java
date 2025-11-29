package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.request.LoginRequest;
import com.gameshop.model.dto.response.LoginResponse;
import com.gameshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs xác thực người dùng (Admin & Customer)")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
        summary = "Đăng nhập", 
        description = "Đăng nhập với username và password. Role: ADMIN hoặc CUSTOMER"
    )
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("Đăng nhập thành công", response)
        );
    }

    @PostMapping("/logout")
    @Operation(
        summary = "Đăng xuất", 
        description = "Đăng xuất khỏi hệ thống"
    )
    public ResponseEntity<ApiResponse<Void>> logout(
            @Parameter(description = "ID của account")
            @RequestParam Long accountId
    ) {
        authService.logout(accountId);
        return ResponseEntity.ok(
                ApiResponse.success("Đăng xuất thành công")
        );
    }

    @GetMapping("/validate")
    @Operation(
        summary = "Validate token",
        description = "Kiểm tra token có hợp lệ không"
    )
    public ResponseEntity<ApiResponse<Boolean>> validateToken(
            @Parameter(description = "Token cần validate")
            @RequestParam String token
    ) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(
                ApiResponse.success(
                    isValid ? "Token hợp lệ" : "Token không hợp lệ", 
                    isValid
                )
        );
    }
}