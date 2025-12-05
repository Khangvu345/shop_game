package com.gameshop.controller;

import com.gameshop.model.dto.CreateShipmentRequest;
import com.gameshop.model.dto.ShipmentResponse;
import com.gameshop.model.dto.UpdateShipmentStatusRequest;
import com.gameshop.model.dto.common.ApiResponse;
import com.gameshop.service.ShipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.gameshop.model.dto.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/shipments")
@RequiredArgsConstructor
@Tag(name = "Admin - Quản lý Vận đơn", description = "APIs quản lý vận đơn và vận chuyển (chỉ dành cho Admin)")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    @Operation(summary = "Tạo vận đơn mới", description = "Tạo vận đơn cho đơn hàng đã CONFIRMED hoặc PREPARING. Tự động chuyển đơn hàng sang trạng thái SHIPPED.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tạo vận đơn thành công"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Đơn hàng không hợp lệ hoặc đã có vận đơn"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy đơn hàng")
    })
    public ResponseEntity<ApiResponse<ShipmentResponse>> createShipment(@RequestBody CreateShipmentRequest request) {
        ShipmentResponse response = shipmentService.createShipment(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo vận đơn thành công", response));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái vận đơn", description = "Cập nhật trạng thái vận đơn và tự động đồng bộ trạng thái đơn hàng. Khi chuyển sang RETURNED sẽ tự động hoàn trả stock.")
    @Parameter(name = "id", description = "ID của vận đơn", required = true, example = "1")
    public ResponseEntity<ApiResponse<ShipmentResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateShipmentStatusRequest request) {
        ShipmentResponse response = shipmentService.updateShipmentStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết vận đơn theo Order ID", description = "Lấy thông tin vận đơn của một đơn hàng cụ thể")
    @Parameter(name = "id", description = "ID của đơn hàng", required = true, example = "1")
    public ResponseEntity<ApiResponse<ShipmentResponse>> getShipment(@PathVariable String id) {
        ShipmentResponse response = shipmentService.getShipmentByOrderId(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin vận đơn thành công", response));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách vận đơn (có phân trang)", description = "Xem tất cả vận đơn với khả năng lọc theo đơn hàng hoặc trạng thái")
    @Parameters({
            @Parameter(name = "page", description = "Số trang (bắt đầu từ 0)", example = "0"),
            @Parameter(name = "size", description = "Số bản ghi mỗi trang", example = "10"),
            @Parameter(name = "orderId", description = "Lọc theo ID đơn hàng", required = false, example = "1"),
            @Parameter(name = "status", description = "Lọc theo trạng thái (READY, SHIPPED, DELIVERED, RETURNED)", required = false, example = "SHIPPED")
    })
    public ResponseEntity<ApiResponse<PageResponse<ShipmentResponse>>> getAllShipments(
            Pageable pageable,
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String status) {
        PageResponse<ShipmentResponse> shipments = shipmentService.getAllShipments(pageable, orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vận đơn thành công", shipments));
    }
}
