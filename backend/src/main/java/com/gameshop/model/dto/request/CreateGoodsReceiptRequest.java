package com.gameshop.model.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO để tạo phiếu nhập hàng
 */
public record CreateGoodsReceiptRequest(

        @NotNull(message = "Supplier ID không được để trống")
        Long supplierId,

        @NotBlank(message = "Số hóa đơn không được để trống")
        String invoiceNumber,

        String notes,

        @NotEmpty(message = "Danh sách sản phẩm không được rỗng")
        @Valid
        List<GoodsReceiptItemDto> items
) {
    public record GoodsReceiptItemDto(

            @NotNull(message = "Product ID không được để trống")
            Long productId,

            @NotNull(message = "Số lượng nhập không được để trống")
            @Positive(message = "Số lượng nhập phải lớn hơn 0")
            Integer quantity,

            @NotNull(message = "Đơn giá nhập không được để trống")
            @Positive(message = "Đơn giá nhập phải lớn hơn 0")
            BigDecimal unitCost
    ) {}
}