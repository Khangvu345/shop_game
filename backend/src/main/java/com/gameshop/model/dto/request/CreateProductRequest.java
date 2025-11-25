package com.gameshop.model.dto.request;

import com.gameshop.model.enums.ProductStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {
    @Size(max = 100, message = "SKU không được vượt quá 100 ký tự")
    private String sku;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm không được vượt quá 200 ký tự")
    private String productName;

    private String description;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá sản phẩm phải lớn hơn 0")
    private BigDecimal listPrice;

    @NotNull(message = "Danh mục sản phẩm không được để trống")
    private Long categoryId;

    private ProductStatus status = ProductStatus.Active;
}
