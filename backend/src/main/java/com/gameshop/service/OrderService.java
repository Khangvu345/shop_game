package com.gameshop.service;

import com.gameshop.model.dto.common.CreateOrderRequest;
import com.gameshop.model.dto.common.CreateOrderResponse;

import com.gameshop.model.dto.common.CreateOrderRequest.OrderItemDto;
import com.gameshop.model.dto.common.CreateOrderRequest.OrderAddressDto;

import com.gameshop.model.entity.*;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentStatus;
import com.gameshop.repository.CustomerRepository;
import com.gameshop.repository.OrderRepository;
import com.gameshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class OrderService {

    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;

    @Autowired
    public OrderService(CustomerRepository customerRepo, 
                        ProductRepository productRepo, 
                        OrderRepository orderRepo) {
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
    }

    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        // 1. Record dùng .customerId()
        Customer customer = customerRepo.findById(request.customerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        Order order = new Order();
        order.setCustomer(customer);
        
        // 2. Map Address
        order.setShippingAddress(mapAddress(request.address())); 
        
        // Set trạng thái (Kiểm tra kỹ file Enum OrderStatus trong máy bạn có giá trị này không)
        order.setStatus(OrderStatus.PENDING_PAYMENT); 
        order.setPaymentStatus(PaymentStatus.PENDING);

        BigDecimal grandTotal = BigDecimal.ZERO;

        // 3. Record dùng .items()
        for (OrderItemDto itemDto : request.items()) {
            
            // 4. Record dùng .productId()
            Product product = productRepo.findById(itemDto.productId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            // 5. Record dùng .quantity()
            if (product.getStockQuantity() < itemDto.quantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng!");
            }

            // Trừ tồn kho (Hàm này có được nhờ BƯỚC 2)
            product.setStockQuantity(product.getStockQuantity() - itemDto.quantity());
            productRepo.save(product);

            OrderLine line = new OrderLine();
            line.setOrder(order);
            line.setProduct(product);
            line.setQuantity(itemDto.quantity());
            line.setPrice(product.getPrice());
            
            // Tính toán
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDto.quantity()));
            line.setLineTotal(lineTotal);

            // Hàm getOrderLines() có được nhờ BƯỚC 2
            order.getOrderLines().add(line);
            grandTotal = grandTotal.add(lineTotal);
        }

        order.setSubTotal(grandTotal);
        order.setGrandTotal(grandTotal);

        Order saved = orderRepo.save(order);
        return new CreateOrderResponse(saved.getId(), "Đặt hàng thành công!");
    }

    public Order getOrderDetail(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    // Hàm map Address
    private OrderAddress mapAddress(OrderAddressDto dto) {
        if (dto == null) return null;
        
        OrderAddress address = new OrderAddress();
        address.setRecipientName(dto.recipientName()); 
        address.setPhone(dto.phone());
        address.setStreet(dto.street());
        address.setCity(dto.city());
    
        
        return address;
    }
}