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
import com.gameshop.model.enums.StockMovementReason;
import com.gameshop.repository.AccountRepository;
import com.gameshop.repository.CustomerRepository;
import com.gameshop.repository.OrderRepository;
import com.gameshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final StockMovementService stockMovementService;
    private final AccountRepository accountRepo;

    @Autowired
    public OrderService(CustomerRepository customerRepo,
            ProductRepository productRepo,
            OrderRepository orderRepo,
            StockMovementService stockMovementService,
            AccountRepository accountRepo) {
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.stockMovementService = stockMovementService;
        this.accountRepo = accountRepo;
    }

    // Helper method: Get Customer from accountId
    private Customer getCustomerFromAccountId(String accountIdStr) {
        Long accountId = Long.parseLong(accountIdStr);
        Account account = accountRepo.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (!(account.getParty() instanceof Customer)) {
            throw new RuntimeException("Chỉ khách hàng mới có thể thực hiện thao tác này");
        }

        return (Customer) account.getParty();
    }

    // Helper method: Validate order ownership
    private void validateOrderOwnership(Order order, Customer customer) {
        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Bạn không có quyền truy cập đơn hàng này");
        }
    }

    public CreateOrderResponse createOrder(CreateOrderRequest request, String accountIdStr) {
        // 1. Get customer from authenticated account
        Customer customer = getCustomerFromAccountId(accountIdStr);

        Order order = new Order();
        order.setCustomer(customer);

        // 2. Map Address
        order.setShippingAddress(mapAddress(request.address(), order));

        // 3. Set payment method and initial statuses
        PaymentMethod paymentMethod = PaymentMethod.valueOf(request.paymentMethod().toUpperCase());
        order.setPaymentMethod(paymentMethod);

        // Set status based on payment method
        order.setStatus(OrderStatus.PENDING);
        if (paymentMethod == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.COD_PENDING);
        } else {
            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        BigDecimal grandTotal = BigDecimal.ZERO;

        // 4. Process order items
        int lineNo = 1; // Line number counter
        for (OrderItemDto itemDto : request.items()) {
            Product product = productRepo.findById(itemDto.productId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            if (product.getStockQuantity() < itemDto.quantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng!");
            }

            OrderLine line = new OrderLine();

            // Initialize composite key (will be set properly after order is saved)
            OrderLinePK linePK = new OrderLinePK();
            linePK.setLineNo(lineNo++);
            line.setId(linePK);

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
        // 5. Create stock movements for tracking (after order is saved to get orderId)
        for (OrderLine line : saved.getOrderLines()) {
            stockMovementService.createMovement(
                    line.getProduct().getProductId(),
                    -line.getQuantity(), // Negative = reduce stock
                    StockMovementReason.Sale,
                    "ORDER-" + saved.getId(),
                    saved.getId());
        }
        return new CreateOrderResponse(saved.getId(), "Đặt hàng thành công!");
    }

    public Order getOrderDetail(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    public OrderResponse getOrderDetail(Long id, String accountIdStr) {
        Customer customer = getCustomerFromAccountId(accountIdStr);
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Validate ownership
        validateOrderOwnership(order, customer);

        return mapToOrderResponse(order);
    }

    // Keep old method for admin use
    public OrderResponse getOrderResponse(Long id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        return mapToOrderResponse(order);
    }

    public OrderListResponse getAllOrders(OrderStatus status, PaymentStatus paymentStatus,
            Long customerId, LocalDateTime fromDate, LocalDateTime toDate,
            int page, int size, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Order> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            if (paymentStatus != null) {
                predicates.add(criteriaBuilder.equal(root.get("paymentStatus"), paymentStatus));
            }
            if (customerId != null) {
                predicates.add(criteriaBuilder.equal(root.get("customer").get("id"), customerId));
            }
            if (fromDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), fromDate));
            }
            if (toDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), toDate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Order> orderPage = orderRepo.findAll(spec, pageable);
        List<OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());

        return new OrderListResponse(
                orderResponses,
                orderPage.getTotalPages(),
                orderPage.getTotalElements(),
                orderPage.getNumber(),
                orderPage.getSize());
    }

    public OrderListResponse getMyOrders(String accountIdStr, int page, int size) {
        Customer customer = getCustomerFromAccountId(accountIdStr);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepo.findByCustomerId(customer.getId(), pageable);

        List<OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());

        return new OrderListResponse(
                orderResponses,
                orderPage.getTotalPages(),
                orderPage.getTotalElements(),
                orderPage.getNumber(),
                orderPage.getSize());
    }

    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = getOrderDetail(orderId);

        // Validate status transition
        validateStatusTransition(order, request.status());

        // VNPay orders must be PAID before CONFIRMED/SHIPPED
        if (order.getPaymentMethod() == PaymentMethod.VNPAY) {
            if ((request.status() == OrderStatus.CONFIRMED || request.status() == OrderStatus.PREPARING ||
                    request.status() == OrderStatus.SHIPPED) &&
                    order.getPaymentStatus() != PaymentStatus.PAID) {
                throw new RuntimeException("Đơn hàng VNPay phải thanh toán trước khi xử lý!");
            }
        }

        order.setStatus(request.status());
        orderRepo.save(order);

        return mapToOrderResponse(order);
    }

    public OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request) {
        Order order = getOrderDetail(orderId);
        order.setPaymentStatus(request.paymentStatus());
        orderRepo.save(order);

        return mapToOrderResponse(order);
    }

    public OrderResponse cancelOrder(Long orderId, CancelOrderRequest request, String accountIdStr) {
        Customer customer = getCustomerFromAccountId(accountIdStr);
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Validate ownership (customer can only cancel their own orders)
        validateOrderOwnership(order, customer);

        // Validate cancellation
        if (order.getStatus() == OrderStatus.SHIPPED ||
                order.getStatus() == OrderStatus.DELIVERED ||
                order.getStatus() == OrderStatus.COMPLETED) {
            throw new RuntimeException("Không thể hủy đơn hàng đã giao hoặc đang giao!");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Đơn hàng đã bị hủy trước đó!");
        }

        // Restore stock using StockMovementService for tracking
        for (OrderLine line : order.getOrderLines()) {
            stockMovementService.createMovement(
                    line.getProduct().getProductId(),
                    line.getQuantity(), // Positive = restore stock
                    StockMovementReason.Return,
                    "CANCEL-ORDER-" + orderId,
                    orderId);
        }

        // Update order
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancelReason(request.reason());
        order.setCancelledBy(request.cancelledBy());

        orderRepo.save(order);

        return mapToOrderResponse(order);
    }

    // Helper methods
    private OrderAddress mapAddress(OrderAddressDto dto, Order order) {
        if (dto == null)
            return null;

        OrderAddress address = new OrderAddress();
        address.setOrder(order); // Set bidirectional relationship for @MapsId
        address.setReceiverName(dto.recipientName());
        address.setReceiverPhone(dto.phone());
        address.setLine1(dto.street());
        address.setWard(dto.ward());
        address.setCity(dto.city());

        return address;
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderResponse.OrderItemDto> items = order.getOrderLines().stream()
                .map(line -> new OrderResponse.OrderItemDto(
                        line.getProduct().getId(),
                        line.getProduct().getName(),
                        line.getQuantity(),
                        line.getPrice(),
                        line.getLineTotal()))
                .collect(Collectors.toList());

        OrderResponse.AddressDto addressDto = null;
        if (order.getShippingAddress() != null) {
            OrderAddress addr = order.getShippingAddress();
            addressDto = new OrderResponse.AddressDto(
                    addr.getReceiverName(),
                    addr.getReceiverPhone(),
                    addr.getLine1(),
                    addr.getWard(),
                    addr.getCity());
        }

        return new OrderResponse(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getFullName(),
                addressDto,
                items,
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

    private void validateStatusTransition(Order order, OrderStatus newStatus) {
        OrderStatus currentStatus = order.getStatus();

        // Define allowed transitions
        boolean isAllowed = false;

        switch (currentStatus) {
            case PENDING:
                isAllowed = newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;
                break;
            case CONFIRMED:
                isAllowed = newStatus == OrderStatus.PREPARING || newStatus == OrderStatus.CANCELLED;
                break;
            case PREPARING:
                isAllowed = newStatus == OrderStatus.SHIPPED || newStatus == OrderStatus.CANCELLED;
                break;
            case SHIPPED:
                isAllowed = newStatus == OrderStatus.DELIVERED;
                break;
            case DELIVERED:
                isAllowed = newStatus == OrderStatus.COMPLETED || newStatus == OrderStatus.RETURNED;
                break;
            case COMPLETED:
            case CANCELLED:
            case RETURNED:
                isAllowed = false; // Cannot transition from terminal states
                break;
        }

        if (!isAllowed) {
            throw new RuntimeException(
                    String.format("Không thể chuyển trạng thái từ %s sang %s", currentStatus, newStatus));
        }
    }
}