package com.gameshop.service;

import com.gameshop.model.dto.common.CreateOrderRequest;
import com.gameshop.model.dto.common.CreateOrderResponse;
import com.gameshop.model.dto.common.CreateOrderRequest.OrderItemDto;
import com.gameshop.model.dto.common.CreateOrderRequest.OrderAddressDto;
import com.gameshop.model.dto.request.CancelOrderRequest;
import com.gameshop.model.dto.request.UpdateOrderStatusRequest;
import com.gameshop.model.dto.request.UpdatePaymentStatusRequest;
import com.gameshop.model.dto.response.OrderListResponse;
import com.gameshop.model.dto.response.OrderResponse;
import com.gameshop.model.entity.*;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentMethod;
import com.gameshop.model.enums.PaymentStatus;
import com.gameshop.repository.CustomerRepository;
import com.gameshop.repository.OrderRepository;
import com.gameshop.repository.ProductRepository;
import com.gameshop.validator.OrderWorkflowValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final OrderWorkflowValidator workflowValidator;

    @Autowired
    public OrderService(CustomerRepository customerRepo,
            ProductRepository productRepo,
            OrderRepository orderRepo,
            OrderWorkflowValidator workflowValidator) {
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.workflowValidator = workflowValidator;
    }

    /**
     * Create new order with payment method support
     */
    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        // Validate customer exists
        Customer customer = customerRepo.findById(request.customerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingAddress(mapAddress(request.address()));

        // Set payment method (default to COD if not specified)
        PaymentMethod paymentMethod = request.paymentMethod() != null ? request.paymentMethod() : PaymentMethod.COD;
        order.setPaymentMethod(paymentMethod);

        // Set initial status based on payment method
        order.setStatus(OrderStatus.PENDING);
        if (paymentMethod == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.COD_PENDING);
        } else {
            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        BigDecimal grandTotal = BigDecimal.ZERO;

        // Process order items
        for (OrderItemDto itemDto : request.items()) {
            Product product = productRepo.findById(itemDto.productId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            // Check stock
            if (product.getStockQuantity() < itemDto.quantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng!");
            }

            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - itemDto.quantity());
            productRepo.save(product);

            OrderLine line = new OrderLine();
            line.setOrder(order);
            line.setProduct(product);
            line.setQuantity(itemDto.quantity());
            line.setPrice(product.getPrice());

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDto.quantity()));
            line.setLineTotal(lineTotal);

            order.getOrderLines().add(line);
            grandTotal = grandTotal.add(lineTotal);
        }

        order.setSubTotal(grandTotal);
        order.setGrandTotal(grandTotal);

        Order saved = orderRepo.save(order);
        return new CreateOrderResponse(saved.getId(), "Đặt hàng thành công!");
    }

    /**
     * Get order by ID with full details
     */
    @Transactional(readOnly = true)
    public Order getOrderDetail(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    /**
     * Get order as DTO for API response
     */
    @Transactional(readOnly = true)
    public OrderResponse getOrderResponse(Long id) {
        Order order = getOrderDetail(id);
        return mapToOrderResponse(order);
    }

    /**
     * Get all orders with filtering and pagination (Admin)
     */
    @Transactional(readOnly = true)
    public OrderListResponse getAllOrders(
            OrderStatus status,
            PaymentStatus paymentStatus,
            Long customerId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {

        Page<Order> orderPage = orderRepo.findAllWithFilters(
                status, paymentStatus, customerId, startDate, endDate, pageable);

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());

        return new OrderListResponse(
                content,
                orderPage.getTotalPages(),
                orderPage.getTotalElements(),
                orderPage.getNumber(),
                orderPage.getSize());
    }

    /**
     * Get customer's order history
     */
    @Transactional(readOnly = true)
    public OrderListResponse getCustomerOrders(Long customerId, Pageable pageable) {
        // Verify customer exists
        customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        Page<Order> orderPage = orderRepo.findByCustomerId(customerId, pageable);

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());

        return new OrderListResponse(
                content,
                orderPage.getTotalPages(),
                orderPage.getTotalElements(),
                orderPage.getNumber(),
                orderPage.getSize());
    }

    /**
     * Update order status with workflow validation
     */
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = getOrderDetail(orderId);

        // Validate transition
        workflowValidator.validateOrderStatusTransition(
                order.getStatus(),
                request.status(),
                order.getPaymentMethod(),
                order.getPaymentStatus());

        order.setStatus(request.status());
        Order saved = orderRepo.save(order);

        return mapToOrderResponse(saved);
    }

    /**
     * Update payment status (for COD collection tracking)
     */
    public OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request) {
        Order order = getOrderDetail(orderId);

        // Validate transition
        workflowValidator.validatePaymentStatusTransition(
                order.getPaymentStatus(),
                request.paymentStatus());

        order.setPaymentStatus(request.paymentStatus());
        Order saved = orderRepo.save(order);

        return mapToOrderResponse(saved);
    }

    /**
     * Cancel order and restore stock
     */
    public OrderResponse cancelOrder(Long orderId, CancelOrderRequest request) {
        Order order = getOrderDetail(orderId);

        // Validate cancellation is allowed
        workflowValidator.validateCancellation(order);

        // Restore stock for all items
        for (OrderLine line : order.getOrderLines()) {
            Product product = line.getProduct();
            product.setStockQuantity(product.getStockQuantity() + line.getQuantity());
            productRepo.save(product);
        }

        // Update order status
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancelReason(request.reason());
        order.setCancelledBy(request.cancelledBy());

        Order saved = orderRepo.save(order);
        return mapToOrderResponse(saved);
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Map OrderAddressDto to OrderAddress entity
     */
    private OrderAddress mapAddress(OrderAddressDto dto) {
        if (dto == null)
            return null;

        OrderAddress address = new OrderAddress();
        address.setRecipientName(dto.recipientName());
        address.setPhone(dto.phone());
        address.setStreet(dto.street());
        address.setWard(dto.ward());
        address.setDistrict(dto.district());
        address.setCity(dto.city());

        return address;
    }

    /**
     * Map Order entity to OrderResponse DTO
     */
    private OrderResponse mapToOrderResponse(Order order) {
        // Map address
        OrderResponse.OrderAddressResponse addressResponse = null;
        if (order.getShippingAddress() != null) {
            OrderAddress addr = order.getShippingAddress();
            addressResponse = new OrderResponse.OrderAddressResponse(
                    addr.getRecipientName(),
                    addr.getPhone(),
                    addr.getStreet(),
                    addr.getWard(),
                    addr.getDistrict(),
                    addr.getCity());
        }

        // Map order lines
        List<OrderResponse.OrderLineResponse> lineResponses = order.getOrderLines().stream()
                .map(line -> new OrderResponse.OrderLineResponse(
                        line.getId(),
                        line.getProduct().getId(),
                        line.getProduct().getName(),
                        line.getQuantity(),
                        line.getPrice(),
                        line.getLineTotal()))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getFullName(),
                addressResponse,
                lineResponses,
                order.getSubTotal(),
                order.getGrandTotal(),
                order.getStatus(),
                order.getPaymentStatus(),
                order.getPaymentMethod(),
                order.getCancelledAt(),
                order.getCancelReason(),
                order.getCancelledBy(),
                order.getCreatedAt(),
                order.getUpdatedAt());
    }
}