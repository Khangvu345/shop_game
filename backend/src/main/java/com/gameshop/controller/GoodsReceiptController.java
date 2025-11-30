package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.request.CreateGoodsReceiptRequest;
import com.gameshop.model.dto.request.UpdateGoodsReceiptRequest;
import com.gameshop.model.dto.response.GoodsReceiptListResponse;
import com.gameshop.model.dto.response.GoodsReceiptResponse;
import com.gameshop.service.GoodsReceiptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/admin/goods-receipts")
@RequiredArgsConstructor
@Tag(name = "Goods Receipt Management", description = "APIs quản lý phiếu nhập hàng (Admin)")
public class GoodsReceiptController {

   private final GoodsReceiptService goodsReceiptService;

   @PostMapping
   @Operation(summary = "Tạo phiếu nhập hàng mới",
              description = "Tạo phiếu nhập hàng từ nhà cung cấp. Hệ thống tự động tính giá mua trung bình gia quyền và cập nhật tồn kho.")
   public ResponseEntity<ApiResponse<GoodsReceiptResponse>> createGoodsReceipt(
           @Valid @RequestBody CreateGoodsReceiptRequest request
   ) {
       GoodsReceiptResponse receipt = goodsReceiptService.createGoodsReceipt(request);
       return ResponseEntity.status(HttpStatus.CREATED).body(
               ApiResponse.success("Tạo phiếu nhập hàng thành công", receipt)
       );
   }

   @GetMapping("/{id}")
   @Operation(summary = "Lấy thông tin chi tiết phiếu nhập hàng",
              description = "Lấy thông tin chi tiết của một phiếu nhập hàng theo ID, bao gồm thông tin nhà cung cấp và danh sách sản phẩm")
   public ResponseEntity<ApiResponse<GoodsReceiptResponse>> getGoodsReceiptById(
           @Parameter(description = "ID của phiếu nhập hàng")
           @PathVariable Long id
   ) {
       GoodsReceiptResponse receipt = goodsReceiptService.getGoodsReceiptById(id);
       return ResponseEntity.ok(
               ApiResponse.success("Lấy thông tin phiếu nhập hàng thành công", receipt)
       );
   }

   @GetMapping
   @Operation(summary = "Lấy danh sách phiếu nhập hàng",
              description = "Lấy danh sách phiếu nhập hàng với bộ lọc: nhà cung cấp, khoảng thời gian. Hỗ trợ phân trang.")
   public ResponseEntity<ApiResponse<GoodsReceiptListResponse>> getAllGoodsReceipts(
           @Parameter(description = "ID nhà cung cấp để lọc")
           @RequestParam(required = false) Long supplierId,
           @Parameter(description = "Thời gian bắt đầu (ISO format: yyyy-MM-dd'T'HH:mm:ss)")
           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
           @Parameter(description = "Thời gian kết thúc (ISO format: yyyy-MM-dd'T'HH:mm:ss)")
           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
           @Parameter(description = "Số trang (bắt đầu từ 0)")
           @RequestParam(defaultValue = "0") int page,
           @Parameter(description = "Số lượng mỗi trang")
           @RequestParam(defaultValue = "20") int size
   ) {
       GoodsReceiptListResponse receipts = goodsReceiptService.getAllGoodsReceipts(
               supplierId, fromDate, toDate, page, size
       );
       return ResponseEntity.ok(
               ApiResponse.success("Lấy danh sách phiếu nhập hàng thành công", receipts)
       );
   }
   @PutMapping("/{id}")
   @Operation(summary = "Cập nhật phiếu nhập hàng (chỉ metadata)",
              description = "Cập nhật thông tin phiếu nhập hàng. CHỈ cho phép sửa metadata (notes, invoiceNumber). " +
                      "KHÔNG cho phép sửa items/supplier để tránh chaos với stock tracking. " +
                      "BẮT BUỘC phải ghi lý do cập nhật (updateReason) để audit trail.")
   public ResponseEntity<ApiResponse<GoodsReceiptResponse>> updateGoodsReceipt(
           @Parameter(description = "ID của phiếu nhập hàng")
           @PathVariable Long id,
           @Valid @RequestBody UpdateGoodsReceiptRequest request
   ) {
       GoodsReceiptResponse receipt = goodsReceiptService.updateGoodsReceipt(id, request);
       return ResponseEntity.ok(
               ApiResponse.success("Cập nhật phiếu nhập hàng thành công", receipt)
       );
   }
   @DeleteMapping("/{id}")
   @Operation(summary = "Xóa phiếu nhập hàng",
              description = "Xóa phiếu nhập hàng (Cẩn thận! Chức năng này nên được kiểm soát chặt chẽ)")
   public ResponseEntity<ApiResponse<Void>> deleteGoodsReceipt(
           @Parameter(description = "ID của phiếu nhập hàng")
           @PathVariable Long id
   ) {
       goodsReceiptService.deleteGoodsReceipt(id);
       return ResponseEntity.ok(
               ApiResponse.success("Xóa phiếu nhập hàng thành công")
       );
   }
}