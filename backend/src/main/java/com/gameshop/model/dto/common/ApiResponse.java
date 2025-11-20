package com.gameshop.model.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    private Boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private String error;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<T>(true, message, data, LocalDateTime.now(), null);
    }

    public static <T> ApiResponse<T> success(String message) {
        return success(message, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorDetail) {
        return new ApiResponse<T>(false, message, null, LocalDateTime.now(), errorDetail);
    }

    public static <T> ApiResponse<T> error(String message) {
        return error(message, null);
    }
}