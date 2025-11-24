package com.gameshop.model.dto.request;

import com.gameshop.model.enums.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {
    @Size(max = 100, message = "SKU không được vượt quá 100 ký tự")
    private String sku;

    @Size(max = 200, message = "Tên sản phẩm không được vượt quá 200 ký tự")
    private String productName;

    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Giá sản phẩm phải lớn hơn 0")
    private BigDecimal listPrice;

    private Long categoryId;

    private ProductStatus status;
}
