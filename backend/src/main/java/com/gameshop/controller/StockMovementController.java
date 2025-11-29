package com.gameshop.controller;

import com.gameshop.model.dto.common.ApiResponse;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/stock-movements")
@RequiredArgsConstructor
@Tag(name = "Stock Movement Management", description = "APIs quản lý biến động kho hàng (Admin)")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Lấy lịch sử biến động kho của sản phẩm",
               description = "Lấy tất cả các biến động kho của một sản phẩm, sắp xếp theo thời gian giảm dần")
    public ResponseEntity<ApiResponse<List<StockMovementResponse>>> getStockHistory(
            @Parameter(description = "ID của sản phẩm")
            @PathVariable Long productId
    ) {
        List<StockMovementResponse> movements = stockMovementService.getStockHistory(productId);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy lịch sử biến động kho thành công", movements)
        );
    }

    @GetMapping("/date-range")
    @Operation(summary = "Lấy biến động kho theo khoảng thời gian",
               description = "Lấy tất cả các biến động kho trong khoảng thời gian, sắp xếp theo thời gian giảm dần")
    public ResponseEntity<ApiResponse<List<StockMovementResponse>>> getMovementsByDateRange(
            @Parameter(description = "Thời gian bắt đầu (ISO format: yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "Thời gian kết thúc (ISO format: yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByDateRange(startDate, endDate);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy biến động kho theo khoảng thời gian thành công", movements)
        );
    }

    @GetMapping("/reason/{reason}")
    @Operation(summary = "Lấy biến động kho theo lý do",
               description = "Lấy tất cả các biến động kho theo lý do cụ thể (GoodsReceipt, Sale, Return, DamagedAdjustment, StocktakeAdjustment, ManualAdjustment)")
    public ResponseEntity<ApiResponse<List<StockMovementResponse>>> getMovementsByReason(
            @Parameter(description = "Lý do biến động kho")
            @PathVariable StockMovementReason reason
    ) {
        List<StockMovementResponse> movements = stockMovementService.getMovementsByReason(reason);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy biến động kho theo lý do thành công", movements)
        );
    }

    @PostMapping("/adjust")
    @Operation(summary = "Điều chỉnh kho thủ công",
               description = "Admin điều chỉnh số lượng kho thủ công (tăng/giảm) với lý do: ManualAdjustment, DamagedAdjustment, hoặc StocktakeAdjustment")
    public ResponseEntity<ApiResponse<StockMovementResponse>> adjustStockManually(
            @Valid @RequestBody CreateStockAdjustmentRequest request
    ) {
        StockMovementResponse movement = stockMovementService.adjustStockManually(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Điều chỉnh kho thủ công thành công", movement)
        );
    }

    @GetMapping("/current-stock/{productId}")
    @Operation(summary = "Lấy số lượng tồn kho hiện tại",
               description = "Lấy số lượng tồn kho hiện tại của một sản phẩm")
    public ResponseEntity<ApiResponse<Integer>> getCurrentStock(
            @Parameter(description = "ID của sản phẩm")
            @PathVariable Long productId
    ) {
        Integer currentStock = stockMovementService.getCurrentStock(productId);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy số lượng tồn kho thành công", currentStock)
        );
    }
}