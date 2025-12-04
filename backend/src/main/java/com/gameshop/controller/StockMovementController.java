package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.dto.request.CreateStockAdjustmentRequest;
import com.gameshop.model.dto.response.StockMovementResponse;
import com.gameshop.model.enums.StockMovementReason;
import com.gameshop.service.StockMovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/admin/stock-movements")
@RequiredArgsConstructor
@Tag(name = "Stock Movement Management", description = "APIs quản lý lịch sử tồn kho (Admin)")
public class StockMovementController {

        private final StockMovementService stockMovementService;

        @GetMapping("/product/{productId}")
        @Operation(summary = "Xem lịch sử tồn kho của sản phẩm", description = "Lấy danh sách các lần thay đổi tồn kho của một sản phẩm (có phân trang)")
        public ResponseEntity<ApiResponse<PageResponse<StockMovementResponse>>> getStockHistory(
                        @Parameter(description = "ID của sản phẩm") @PathVariable Long productId,
                        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Số lượng mỗi trang") @RequestParam(defaultValue = "10") int size) {
                PageResponse<StockMovementResponse> history = stockMovementService.getStockHistory(productId, page,
                                size);
                return ResponseEntity.ok(
                                ApiResponse.success("Lấy lịch sử tồn kho thành công", history));
        }

        @GetMapping("/filter/date-range")
        @Operation(summary = "Lọc lịch sử theo khoảng thời gian", description = "Lấy danh sách thay đổi tồn kho trong khoảng thời gian (có phân trang)")
        public ResponseEntity<ApiResponse<PageResponse<StockMovementResponse>>> getMovementsByDateRange(
                        @Parameter(description = "Thời gian bắt đầu (yyyy-MM-dd HH:mm:ss)") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDate,
                        @Parameter(description = "Thời gian kết thúc (yyyy-MM-dd HH:mm:ss)") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDate,
                        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Số lượng mỗi trang") @RequestParam(defaultValue = "10") int size) {
                PageResponse<StockMovementResponse> movements = stockMovementService.getMovementsByDateRange(startDate,
                                endDate, page, size);
                return ResponseEntity.ok(
                                ApiResponse.success("Lọc lịch sử tồn kho thành công", movements));
        }

        @GetMapping("/filter/reason")
        @Operation(summary = "Lọc lịch sử theo lý do", description = "Lấy danh sách thay đổi tồn kho theo lý do cụ thể (có phân trang)")
        public ResponseEntity<ApiResponse<PageResponse<StockMovementResponse>>> getMovementsByReason(
                        @Parameter(description = "Lý do thay đổi (ImportGoods, OrderPlacement, OrderCancellation, etc.)") @RequestParam StockMovementReason reason,
                        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Số lượng mỗi trang") @RequestParam(defaultValue = "10") int size) {
                PageResponse<StockMovementResponse> movements = stockMovementService.getMovementsByReason(reason, page,
                                size);
                return ResponseEntity.ok(
                                ApiResponse.success("Lọc lịch sử tồn kho thành công", movements));
        }

        @PostMapping("/adjust")
        @Operation(summary = "Điều chỉnh tồn kho thủ công", description = "Admin điều chỉnh số lượng tồn kho (kiểm kê, hư hỏng, v.v.)")
        public ResponseEntity<ApiResponse<StockMovementResponse>> adjustStock(
                        @Valid @RequestBody CreateStockAdjustmentRequest request) {
                StockMovementResponse response = stockMovementService.adjustStockManually(request);
                return ResponseEntity.ok(
                                ApiResponse.success("Điều chỉnh tồn kho thành công", response));
        }

        @GetMapping("/product/{productId}/current")
        @Operation(summary = "Xem tồn kho hiện tại", description = "Lấy số lượng tồn kho hiện tại của một sản phẩm")
        public ResponseEntity<ApiResponse<Integer>> getCurrentStock(
                        @Parameter(description = "ID của sản phẩm") @PathVariable Long productId) {
                Integer currentStock = stockMovementService.getCurrentStock(productId);
                return ResponseEntity.ok(
                                ApiResponse.success("Lấy tồn kho hiện tại thành công", currentStock));
        }
}