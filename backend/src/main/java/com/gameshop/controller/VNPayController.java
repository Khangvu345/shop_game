package com.gameshop.controller;

import com.gameshop.model.dto.request.VNPayPaymentRequest;
import com.gameshop.model.dto.response.OrderResponse;
import com.gameshop.model.dto.response.VNPayPaymentResponse;
import com.gameshop.service.VNPayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

/**
 * VNPay Payment Controller
 * REST API endpoints cho tích hợp VNPay Payment Gateway
 */
@RestController
@RequestMapping("/api/v1/payments/vnpay")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "VNPay Payment", description = "Tích hợp cổng thanh toán VNPay")
public class VNPayController {

    private final VNPayService vnPayService;

    /**
     * Tạo VNPay payment URL
     * Frontend gọi API này sau khi tạo order thành công
     * 
     * @param request     VNPayPaymentRequest chứa orderId
     * @param httpRequest HttpServletRequest để lấy IP address
     * @return VNPayPaymentResponse chứa payment URL
     */
    @PostMapping("/create-payment")
    @Operation(summary = "Tạo URL thanh toán VNPay", description = "Tạo URL thanh toán VNPay cho đơn hàng. Khách hàng sẽ được chuyển hướng đến URL này để hoàn thành thanh toán.")
    public ResponseEntity<VNPayPaymentResponse> createPayment(
            @Valid @RequestBody VNPayPaymentRequest request,
            HttpServletRequest httpRequest) {

        log.info("Received create payment request for order: {}", request.orderId());

        // Lấy IP address của khách hàng
        String ipAddress = getIpAddress(httpRequest);

        // Tạo payment URL
        VNPayPaymentResponse response = vnPayService.createPaymentUrl(request, ipAddress);

        log.info("Payment URL created successfully for order: {}", request.orderId());

        return ResponseEntity.ok(response);
    }

    /**
     * VNPay callback endpoint
     * VNPay gọi endpoint này sau khi khách hàng hoàn thành thanh toán
     * Endpoint này PHẢI là public (không cần authentication)
     * 
     * @param params Query parameters từ VNPay
     * @return Redirect về frontend với kết quả thanh toán
     */
    @GetMapping("/callback")
    @Operation(summary = "Xử lý callback từ VNPay", description = "Endpoint công khai để báo kết quả thanh toán từ VNPay. VNPay server sẽ gọi endpoint này và chuyển hướng user về frontend.")
    public ResponseEntity<Void> paymentCallback(@RequestParam Map<String, String> params) {

        log.info("========== VNPay Callback Received ==========");
        log.info("Callback params count: {}", params.size());
        log.info("vnp_ResponseCode: {}", params.get("vnp_ResponseCode"));
        log.info("vnp_TxnRef: {}", params.get("vnp_TxnRef"));
        log.info("vnp_OrderInfo: {}", params.get("vnp_OrderInfo"));
        log.info("=============================================");

        try {
            // Xử lý callback và cập nhật payment status
            OrderResponse order = vnPayService.handleCallback(params);

            // Build redirect URL về frontend
            String redirectUrl = buildFrontendRedirectUrl(order);

            if (redirectUrl == null || redirectUrl.isEmpty()) {
                throw new RuntimeException("Tạo URL chuyển hướng thất bại");
            }

            log.info("Payment callback processed successfully. Redirecting to: {}", redirectUrl);

            // Redirect về frontend
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(redirectUrl))
                    .build();

        } catch (Exception e) {
            log.error("Error processing VNPay callback", e);

            // Redirect về error page
            String errorUrl = buildFrontendErrorUrl(e.getMessage());

            if (errorUrl == null || errorUrl.isEmpty()) {
                errorUrl = "http://localhost:5173/payment/error?message=Unknown+error";
            }

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(errorUrl))
                    .build();
        }
    }

    /**
     * Lấy IP address của khách hàng
     * Ưu tiên lấy từ X-Forwarded-For header (nếu có proxy/load balancer)
     * 
     * @param request HttpServletRequest
     * @return IP address
     */
    private String getIpAddress(HttpServletRequest request) {
        // Lấy IP address từ X-Forwarded-For header (nếu có) hoặc remote address
        // VNPay yêu cầu IP của khách hàng để tracking và bảo mật
        String ipAddress = request.getHeader("X-Forwarded-For");

        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("X-Real-IP");
        }

        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }

        // X-Forwarded-For có thể chứa nhiều IP (phân cách bởi dấu phẩy)
        // Lấy IP đầu tiên (client IP)
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }

        log.debug("Client IP address: {}", ipAddress);
        return ipAddress;
    }

    /**
     * Build redirect URL về frontend sau khi thanh toán thành công/thất bại
     * 
     * @param order        Order đã được cập nhật payment status
     * @return Frontend URL
     */
    private String buildFrontendRedirectUrl(OrderResponse order) {
        // Frontend sẽ handle hiển thị kết quả thanh toán
        String baseUrl = "http://localhost:5173/my-orders";

        return String.format("%s/%s",
                baseUrl,
                order.orderId());
    }

    /**
     * Build redirect URL về error page khi có lỗi xử lý callback
     * 
     * @param errorMessage Error message
     * @return Frontend error URL
     */
    private String buildFrontendErrorUrl(String errorMessage) {
        String baseUrl = "http://localhost:5173/payment/error";
        return String.format("%s?message=%s", baseUrl, errorMessage);
    }
}
