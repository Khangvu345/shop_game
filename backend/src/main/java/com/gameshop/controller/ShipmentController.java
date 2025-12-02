package com.gameshop.controller;
import com.gameshop.model.dto.CreateShipmentRequest;
import com.gameshop.model.dto.ShipmentResponse;
import com.gameshop.model.dto.UpdateShipmentStatusRequest;
import com.gameshop.service.ShipmentService;
import com.gameshop.service.impl.ShipmentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/shipments")
public class ShipmentController {

    @Autowired
    private ShipmentServiceImpl shipmentService;

    @PostMapping
    public ResponseEntity<ShipmentResponse> createShipment(@RequestBody CreateShipmentRequest request) {
        return ResponseEntity.ok(shipmentService.createShipment(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ShipmentResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateShipmentStatusRequest request) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentResponse> getShipment(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipmentByOrderId(id));
    }

    @GetMapping
    public ResponseEntity<Page<ShipmentResponse>> getAllShipments(
            Pageable pageable,
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) String status
    ) {
        Page<ShipmentResponse> shipments =
                shipmentService.getAllShipments(pageable, orderId, status);

        return ResponseEntity.ok(shipments);
    }

}
