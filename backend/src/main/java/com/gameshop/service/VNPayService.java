package com.gameshop.service;

import com.gameshop.config.VNPayConfig;
import com.gameshop.model.dto.request.VNPayPaymentRequest;
import com.gameshop.model.dto.request.UpdatePaymentStatusRequest;
import com.gameshop.model.dto.response.OrderResponse;
import com.gameshop.model.dto.response.VNPayPaymentResponse;
import com.gameshop.model.entity.Order;
import com.gameshop.model.enums.OrderStatus;
import com.gameshop.model.enums.PaymentMethod;
import com.gameshop.model.enums.PaymentStatus;
import com.gameshop.repository.OrderRepository;
import com.gameshop.util.VNPayUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * VNPay Payment Service
 * Xử lý logic tích hợp với VNPay Payment Gateway
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    /**
     * Tạo URL thanh toán VNPay
     * 
     * @param request   Request từ frontend
     * @param ipAddress IP address của khách hàng
     * @return VNPayPaymentResponse chứa payment URL
     */
    public VNPayPaymentResponse createPaymentUrl(VNPayPaymentRequest request, String ipAddress) {
        log.info("Creating VNPay payment URL for order: {}", request.orderId());

        // 1. Lấy order từ database
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + request.orderId()));

        // 2. Validate order
        validateOrderForPayment(order);

        // 3. Tạo unique transaction reference
        String txnRef = "VNP" + System.currentTimeMillis();

        // 4. Build VNPay parameters
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());

        // Số tiền thanh toán (VND x 100 để triệt tiêu phần thập phân)
        long amount = order.getGrandTotal().longValue() * 100;
        vnpParams.put("vnp_Amount", String.valueOf(amount));

        vnpParams.put("vnp_CurrCode", "VND");

        // Bank code (tùy chọn phương thức thanh toán)
        if (request.bankCode() != null && !request.bankCode().isEmpty()) {
            vnpParams.put("vnp_BankCode", request.bankCode());
        }

        vnpParams.put("vnp_TxnRef", txnRef);

        // Order info: Ưu tiên lấy từ Order.notes, nếu không có thì tự generate
        String orderInfo = order.getNotes();
        if (orderInfo == null || orderInfo.isEmpty()) {
            orderInfo = "Thanh toán đơn hàng " + order.getId();
        }
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "other");

        // Locale (language)
        String locale = request.language();
        if (locale == null || locale.isEmpty()) {
            locale = "vn";
        }
        vnpParams.put("vnp_Locale", locale);

        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", ipAddress);

        // Thời gian tạo và hết hạn (GMT+7)
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(calendar.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        calendar.add(Calendar.MINUTE, 3); // Hết hạn sau 3 phút
        String vnpExpireDate = formatter.format(calendar.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        // Billing info (tùy chọn nhưng tăng tỷ lệ thành công)
        if (order.getShippingAddress() != null) {
            vnpParams.put("vnp_Bill_Mobile", order.getShippingAddress().getReceiverPhone());
            vnpParams.put("vnp_Bill_Email", order.getCustomer().getEmail());

            // Parse full name thành first name và last name
            String fullName = order.getShippingAddress().getReceiverName();
            if (fullName != null && !fullName.isEmpty()) {
                int lastSpaceIndex = fullName.lastIndexOf(' ');
                if (lastSpaceIndex > 0) {
                    String firstName = fullName.substring(0, lastSpaceIndex);
                    String lastName = fullName.substring(lastSpaceIndex + 1);
                    vnpParams.put("vnp_Bill_FirstName", firstName);
                    vnpParams.put("vnp_Bill_LastName", lastName);
                }
            }

            vnpParams.put("vnp_Bill_Address", order.getShippingAddress().getLine1());
            vnpParams.put("vnp_Bill_City", order.getShippingAddress().getCity());
            vnpParams.put("vnp_Bill_Country", "VN");
        }

        // 5. Tạo secure hash
        String hashData = VNPayUtil.buildHashData(vnpParams);
        String secureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData);

        // 6. Tạo query string
        String queryUrl = VNPayUtil.buildQueryString(vnpParams);
        queryUrl += "&vnp_SecureHash=" + secureHash;

        String paymentUrl = vnPayConfig.getPaymentUrl() + "?" + queryUrl;

        log.info("VNPay payment URL created successfully. TxnRef: {}, Amount: {}", txnRef, amount);

        return new VNPayPaymentResponse(
                paymentUrl,
                order.getId(),
                txnRef,
                amount / 100, // Convert back to VND
                LocalDateTime.now());
    }

    /**
     * Xử lý callback từ VNPay sau khi khách hàng thanh toán
     * 
     * @param params Query parameters từ VNPay
     * @return OrderResponse sau khi cập nhật payment status
     */
    public OrderResponse handleCallback(Map<String, String> params) {
        log.info("Handling VNPay callback. Params: {}", params);

        // 1. Kiểm tra secure hash
        String receivedHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        if (!validateSecureHash(params, receivedHash)) {
            log.error("Invalid secure hash from VNPay callback");
            throw new SecurityException("Invalid secure hash from VNPay");
        }

        // 2. Phân tích dữ liệu callback
        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        String amountStr = params.get("vnp_Amount");
        long vnpayAmount = Long.parseLong(amountStr) / 100; // Convert về VND

        // Extract orderId từ vnp_OrderInfo hoặc txnRef
        // Vì chúng ta không lưu mapping txnRef -> orderId,
        // cần parse từ vnp_OrderInfo
        String orderInfo = params.get("vnp_OrderInfo");
        String orderId = extractOrderIdFromOrderInfo(orderInfo);

        log.info("VNPay callback - OrderId: {}, ResponseCode: {}, Amount: {}",
                orderId, responseCode, vnpayAmount);

        // 3. Lấy order và validate
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));

        // Validate amount
        if (vnpayAmount != order.getGrandTotal().longValue()) {
            log.error("Amount mismatch. Expected: {}, Received: {}",
                    order.getGrandTotal().longValue(), vnpayAmount);
            throw new RuntimeException("Số tiền không khớp với đơn hàng");
        }

        // 4. Cập nhật payment status dựa trên response code
        PaymentStatus newPaymentStatus;
        if ("00".equals(responseCode)) {
            // Thành công
            newPaymentStatus = PaymentStatus.PAID;
            log.info("Payment successful for order: {}", orderId);
        } else {
            // Thất bại
            newPaymentStatus = PaymentStatus.FAILED;
            log.warn("Payment failed for order: {}. Response code: {}", orderId, responseCode);
        }

        // Kiểm tra idempotency - tránh update trùng lặp
        if (order.getPaymentStatus() == newPaymentStatus) {
            log.warn("Order {} already has payment status: {}. Ignoring duplicate callback.",
                    orderId, newPaymentStatus);
            return orderService.getOrderResponse(orderId);
        }

        // 5. Update payment status qua OrderService
        UpdatePaymentStatusRequest updateRequest = new UpdatePaymentStatusRequest(
                newPaymentStatus,
                null, // collectedBy
                LocalDateTime.now(), // collectedAt
                "VNPay callback - TxnRef: " + txnRef + ", ResponseCode: " + responseCode);

        return orderService.updatePaymentStatus(orderId, updateRequest);
    }

    /**
     * Validate secure hash từ VNPay
     * 
     * @param params       Query parameters (không bao gồm vnp_SecureHash)
     * @param receivedHash Hash nhận được từ VNPay
     * @return true nếu hash hợp lệ
     */
    public boolean validateSecureHash(Map<String, String> params, String receivedHash) {
        String hashData = VNPayUtil.buildHashData(params);
        String calculatedHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData);

        boolean isValid = calculatedHash.equals(receivedHash);
        if (!isValid) {
            log.error("Secure hash validation failed. Expected: {}, Received: {}",
                    calculatedHash, receivedHash);
        }

        return isValid;
    }

    /**
     * Validate order trước khi tạo payment URL
     */
    private void validateOrderForPayment(Order order) {

        // Phải là VNPAY payment method
        if (order.getPaymentMethod() != PaymentMethod.VNPAY) {
            throw new RuntimeException("Đơn hàng không sử dụng phương thức thanh toán VNPay");
        }

        // Payment status phải là PENDING
        if (order.getPaymentStatus() != PaymentStatus.PENDING && order.getPaymentStatus() != PaymentStatus.FAILED) {
            throw new RuntimeException("Đơn hàng đã được thanh toán hoặc không ở trạng thái chờ thanh toán");
        }
        // Đơn hàng phải chưa bị hủy
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Đơn hàng đã bị hủy");
        }
    }

    /**
     * Extract orderId từ orderInfo string
     * Format: "Thanh toán đơn hàng {orderId}"
     */
    private String extractOrderIdFromOrderInfo(String orderInfo) {
        if (orderInfo == null || orderInfo.isEmpty()) {
            throw new RuntimeException("Order info is empty");
        }

        // Pattern: "Thanh toán đơn hàng DH20251207001"
        String[] parts = orderInfo.split(" ");
        if (parts.length > 0) {
            String lastPart = parts[parts.length - 1];
            // Assuming orderId starts with "DH"
            if (lastPart.startsWith("DH")) {
                return lastPart;
            }
        }

        // Fallback: tìm pattern DH + số
        for (String part : parts) {
            if (part.matches("DH\\d+")) {
                return part;
            }
        }

        throw new RuntimeException("Cannot extract orderId from orderInfo: " + orderInfo);
    }
}
