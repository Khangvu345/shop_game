//@@ -0,0 +1,29 @@
//package com.gameshop.model.dto.request;
//
//import jakarta.validation.constraints.NotBlank;
//
///**
// * DTO để cập nhật phiếu nhập hàng
// *
// * LƯU Ý: Chỉ cho phép sửa METADATA (notes, invoiceNumber)
// * KHÔNG cho phép sửa items hoặc supplier để tránh chaos với stock tracking
// *
// * Lý do giới hạn:
// * - Stock đã được tăng và tracked trong stock_movement
// * - Purchase price đã được tính weighted average và cập nhật vào product
// * - Nếu cho phép sửa items → phải rollback tất cả stock movements cũ, recalculate weighted average → rất phức tạp và dễ lỗi
// *
// * Workaround nếu cần sửa items/supplier:
// * - Xóa phiếu nhập cũ (DELETE)
// * - Tạo phiếu nhập mới (POST) với thông tin đúng
// * - Admin tự điều chỉnh stock bằng manual adjustment nếu cần
// */
//public record UpdateGoodsReceiptRequest(
//        String invoiceNumber,  // Có thể sửa số hóa đơn nếu ghi sai
//
//        String notes,          // Có thể sửa ghi chú
//
//        @NotBlank(message = "Phải ghi lý do cập nhật")
//        String updateReason    // BẮT BUỘC: Lý do sửa phiếu nhập (để tracking/audit)
//) {
//}