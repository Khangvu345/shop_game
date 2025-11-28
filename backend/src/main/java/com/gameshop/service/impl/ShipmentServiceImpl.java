package com.gameshop.service.impl;

import com.gameshop.model.dto.*;
import com.gameshop.model.entity.Order;
import com.gameshop.model.entity.Shipment;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.ShipmentStatus;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.exception.BusinessException;
import com.gameshop.repository.OrderRepository;
import com.gameshop.repository.ShipmentRepository;
import com.gameshop.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public ShipmentResponse createShipment(CreateShipmentRequest req) {
        Order order = orderRepository.findById(req.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + req.orderId()));

        // Chỉ tạo vận đơn khi đơn đã CONFIRMED hoặc PREPARING
        if (order.getStatus() != OrderStatus.CONFIRMED && order.getStatus() != OrderStatus.PREPARING) {
            throw new BusinessException("Không thể tạo vận đơn. Đơn hàng phải ở trạng thái CONFIRMED hoặc PREPARING");
        }

        // Không cho tạo 2 vận đơn
        if (shipmentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new BusinessException("Đơn hàng này đã có vận đơn rồi!");
        }

        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setCarrier(req.carrier());
        shipment.setTrackingNo(req.trackingNo());
        shipment.setEstimatedDelivery(req.estimatedDelivery() != null
                ? req.estimatedDelivery().atTime(23, 59, 59)
                : null);
        shipment.setStatus(ShipmentStatus.Ready);
        shipment.setShippedAt(LocalDateTime.now()); // Bắt đầu giao ngay khi tạo vận đơn

        shipment = shipmentRepository.save(shipment);

        // Tạo vận đơn → chuyển đơn hàng sang SHIPPED
        order.setStatus(OrderStatus.SHIPPED);
        orderRepository.save(order);

        return toResponse(shipment);
    }

    @Override
    @Transactional
    public ShipmentResponse updateShipmentStatus(Long shipmentId, UpdateShipmentStatusRequest req) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vận đơn ID: " + shipmentId));

        Order order = shipment.getOrder();

        // Cập nhật thời gian thực tế
        if (req.status() == ShipmentStatus.Shipped) {
            shipment.setShippedAt(LocalDateTime.now());
        }

        if (req.status() == ShipmentStatus.Delivered) {
            shipment.setDeliveredAt(req.deliveredAt() != null ? req.deliveredAt() : LocalDateTime.now());
        } else {
            shipment.setDeliveredAt(null);
        }

        // Ghi chú thêm
        // Cập nhật trạng thái vận đơn
        shipment.setStatus(req.status());

        // === ĐỒNG BỘ TRẠNG THÁI ĐƠN HÀNG ===
        switch (req.status()) {
            case Shipped -> order.setStatus(OrderStatus.SHIPPED);
            case Delivered -> order.setStatus(OrderStatus.DELIVERED);
            case Returned -> {
                order.setStatus(OrderStatus.RETURNED);
                // TODO: restore stock nếu cần
            }
            case Ready -> order.setStatus(OrderStatus.PREPARING); // nếu quay lại
            // Không có CANCELLED cho shipment → hợp lý
        }

        shipmentRepository.save(shipment);
        orderRepository.save(order);

        return toResponse(shipment);
    }

    @Override
    public ShipmentResponse getShipmentById(Long shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Vận đơn không tồn tại"));
    }

    @Override
    public ShipmentResponse getShipmentByOrderId(Long orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng chưa có vận đơn"));
    }

    @Override
    public Page<ShipmentResponse> getAllShipments(Pageable pageable, Long orderId, String status) {
        Page<Shipment> page;

        if (orderId != null) {
            Shipment shipment = shipmentRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vận đơn cho đơn hàng: " + orderId));
            List<Shipment> list = Collections.singletonList(shipment);
            page = new PageImpl<>(list, pageable, 1);
        } else if (status != null && !status.isBlank()) {
            try {
                ShipmentStatus s = ShipmentStatus.valueOf(status.toUpperCase());
                page = shipmentRepository.findByStatus(s, pageable);
            } catch (IllegalArgumentException e) {
                throw new BusinessException("Trạng thái vận đơn không hợp lệ: " + status);
            }
        } else {
            page = shipmentRepository.findAll(pageable);
        }

        return page.map(this::toResponse);
    }

    private ShipmentResponse toResponse(Shipment s) {
        LocalDate estDate = s.getEstimatedDelivery() != null
                ? s.getEstimatedDelivery().toLocalDate()
                : null;

        return new ShipmentResponse(
                s.getShipmentId(),
                s.getOrder().getId(),
                s.getCarrier(),
                s.getTrackingNo(),
                estDate,
                s.getShippedAt(),
                s.getDeliveredAt(),
                s.getStatus()
        );
    }
}