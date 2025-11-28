package com.gameshop.service.impl;

import com.gameshop.model.dto.CreateShipmentRequest;
import com.gameshop.model.dto.ShipmentResponse;
import com.gameshop.model.dto.UpdateShipmentStatusRequest;
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
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + req.orderId()));

        // Chỉ cho tạo vận đơn khi đơn đã Confirmed hoặc Paid
        // (Hiện tại hệ thống chưa phân biệt COD/online → chấp nhận cả 2)
        if (order.getStatus() != OrderStatus.Paid && order.getStatus() != OrderStatus.Confirmed) {
            throw new BusinessException("Chỉ có thể tạo vận đơn cho đơn hàng đã Confirmed hoặc Paid");
        }

        if (shipmentRepository.findByOrder(order).isPresent()) {
            throw new BusinessException("Đơn hàng này đã có vận đơn rồi");
        }

        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setCarrier(req.carrier());
        shipment.setTrackingNo(req.trackingNo());
        shipment.setEstimatedDelivery(req.estimatedDelivery() != null
                ? req.estimatedDelivery().atTime(23, 59, 59)
                : null);
        shipment.setNotes(req.notes());
        shipment.setStatus(ShipmentStatus.READY);

        shipment = shipmentRepository.save(shipment);

        // Khi tạo vận đơn → chuyển đơn hàng thành Shipped
        order.setStatus(OrderStatus.Shipped);
        orderRepository.save(order);

        return toResponse(shipment);
    }

    @Override
    @Transactional
    public ShipmentResponse updateShipmentStatus(Long shipmentId, UpdateShipmentStatusRequest req) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found: " + shipmentId));

        Order order = shipment.getOrder();

        // Cập nhật thời gian
        if (req.status() == ShipmentStatus.DELIVERED) {
            shipment.setDeliveredAt(req.deliveredAt() != null ? req.deliveredAt() : LocalDateTime.now());
        } else {
            shipment.setDeliveredAt(null);
        }

        if (req.status() == ShipmentStatus.SHIPPED) {
            shipment.setShippedAt(LocalDateTime.now());
        }

        shipment.setStatus(req.status());
        if (req.note() != null && !req.note().isBlank()) {
            shipment.setNotes(req.note());
        }

        // Đồng bộ trạng thái đơn hàng
        switch (req.status()) {
            case SHIPPED -> order.setStatus(OrderStatus.SHIPPED);
            case DELIVERED -> order.setStatus(OrderStatus.DELIVERED);
            case RETURNED -> {
                order.setStatus(OrderStatus.RETURNED);
                restoreStock(order);
            }
            default -> {}
        }

        shipmentRepository.save(shipment);
        orderRepository.save(order);

        return toResponse(shipment);
    }

    @Override
    public ShipmentResponse getShipmentById(Long shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));
    }

    @Override
    public ShipmentResponse getShipmentByOrderId(Long orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found for order: " + orderId));
    }

    @Override
    public Page<ShipmentResponse> getAllShipments(Pageable pageable, Long orderId, String status) {
        Page<Shipment> page;

        if (orderId != null) {
            Shipment shipment = shipmentRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Shipment not found for order: " + orderId));
            List<Shipment> list = Collections.singletonList(shipment);
            page = new PageImpl<>(list, pageable, list.size());
        } else if (status != null && !status.isBlank()) {
            ShipmentStatus s = ShipmentStatus.valueOf(status.toUpperCase());
            page = shipmentRepository.findByStatus(s, pageable);
        } else {
            page = shipmentRepository.findAll(pageable);
        }

        return page.map(this::toResponse);
    }

    private void restoreStock(Order order) {
        // TODO: implement khi có OrderItem + ProductVariant
    }

    private ShipmentResponse toResponse(Shipment s) {
        LocalDate estimatedDeliveryDate = s.getEstimatedDelivery() != null
                ? s.getEstimatedDelivery().toLocalDate()
                : null;

        return new ShipmentResponse(
                s.getShipmentId(),
                s.getOrder().getOrderId(),
                s.getCarrier(),
                s.getTrackingNo(),
                estimatedDeliveryDate,
                s.getShippedAt(),
                s.getDeliveredAt(),
                s.getStatus(),
                s.getNotes()
        );
    }
}