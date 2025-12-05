package com.gameshop.service.impl;

import com.gameshop.model.dto.*;
import com.gameshop.model.dto.common.PageResponse;
import com.gameshop.model.entity.Shipment;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.ShipmentStatus;
import com.gameshop.exception.BusinessException;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.repository.OrderRepository;
import com.gameshop.repository.ShipmentRepository;
import com.gameshop.service.ShipmentService;
import com.gameshop.service.StockService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    private final StockService stockService;

    @Override
    @Transactional
    public ShipmentResponse createShipment(CreateShipmentRequest req) {
        String orderId = req.orderId();

        // 1. Kiểm tra tồn tại + lấy status bằng 1 query duy nhất
        OrderStatus currentStatus = orderRepository.getOrderStatusById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + orderId));

        // 2. Kiểm tra trạng thái hợp lệ
        if (currentStatus != OrderStatus.CONFIRMED && currentStatus != OrderStatus.PREPARING) {
            throw new BusinessException("Không thể tạo vận đơn. Đơn hàng phải ở trạng thái CONFIRMED hoặc PREPARING");
        }

        // 3. Kiểm tra đã có shipment chưa
        if (shipmentRepository.findByOrderId(orderId).isPresent()) {
            throw new BusinessException("Đơn hàng này đã có vận đơn rồi!");
        }

        Shipment shipment = new Shipment();
        shipment.setOrderId(req.orderId());
        shipment.setCarrier(req.carrier());
        shipment.setTrackingNo(req.trackingNo());
        shipment.setEstimatedDelivery(req.estimatedDelivery());
        shipment.setShippedAt(LocalDateTime.now());
        shipment.setStatus(ShipmentStatus.Ready);

        shipment = shipmentRepository.save(shipment);

        // Tạo vận đơn → chuyển đơn hàng sang SHIPPED
        orderRepository.updateOrderStatus(req.orderId(), OrderStatus.SHIPPED);
        return toResponse(shipment);
    }

    @Override
    @Transactional
    public ShipmentResponse updateShipmentStatus(Long shipmentId, UpdateShipmentStatusRequest req) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vận đơn ID: " + shipmentId));

        ShipmentStatus oldStatus = shipment.getStatus();
        if (req.status() == ShipmentStatus.Shipped) {
            shipment.setShippedAt(LocalDateTime.now());
        }

        if (req.status() == ShipmentStatus.Delivered) {
            shipment.setDeliveredAt(req.deliveredAt() != null ? req.deliveredAt() : LocalDateTime.now());
        } else {
            shipment.setDeliveredAt(null);
        }

        shipment.setStatus(req.status());
        shipmentRepository.saveAndFlush(shipment);

        String orderId = shipment.getOrderId();

        switch (req.status()) {
            case Shipped -> orderRepository.updateOrderStatus(orderId, OrderStatus.SHIPPED);
            case Delivered -> orderRepository.updateOrderStatus(orderId, OrderStatus.DELIVERED);
            case Returned -> {
                orderRepository.updateOrderStatus(orderId, OrderStatus.RETURNED);
                // Hoàn trả stock khi khách trả hàng
                if (oldStatus != ShipmentStatus.Returned) {
                    stockService.restoreStockForReturnedOrder(orderId);
                    System.out.println("ĐÃ HOÀN TRẢ STOCK CHO ĐƠN HÀNG TRẢ: " + orderId);
                }
            }
            case Ready -> {
                /* Do nothing for Ready status update */ }
        }

        return toResponse(shipment);
    }

    @Override
    public ShipmentResponse getShipmentById(Long shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Vận đơn không tồn tại"));
    }

    @Override
    public ShipmentResponse getShipmentByOrderId(String orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng chưa có vận đơn"));
    }

    @Override
    public PageResponse<ShipmentResponse> getAllShipments(Pageable pageable, String orderId, String status) {
        Page<Shipment> page;

        if (orderId != null) {
            Shipment shipment = shipmentRepository.findByOrderId(orderId)
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Không tìm thấy vận đơn cho đơn hàng: " + orderId));
            List<Shipment> list = Collections.singletonList(shipment);
            page = new PageImpl<>(list, pageable, 1);
        } else if (status != null && !status.isBlank()) {
            try {
                // Capitalize first letter to match enum format: Ready, Shipped, Delivered,
                // Returned
                String capitalizedStatus = status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase();
                ShipmentStatus s = ShipmentStatus.valueOf(capitalizedStatus);
                page = shipmentRepository.findByStatus(s, pageable);
            } catch (IllegalArgumentException e) {
                throw new BusinessException("Trạng thái vận đơn không hợp lệ: " + status);
            }
        } else {
            page = shipmentRepository.findAll(pageable);
        }

        List<ShipmentResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                page.getTotalPages(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize());
    }

    private ShipmentResponse toResponse(Shipment s) {
        LocalDate estimatedDate = s.getEstimatedDelivery();

        return new ShipmentResponse(
                s.getShipmentId(),
                s.getOrderId(),
                s.getCarrier(),
                s.getTrackingNo(),
                estimatedDate,
                s.getShippedAt(),
                s.getDeliveredAt(),
                s.getStatus());
    }
}