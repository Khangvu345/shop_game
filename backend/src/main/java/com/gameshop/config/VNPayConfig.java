package com.gameshop.config;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * VNPay Payment Gateway Configuration
 * Cấu hình tích hợp cổng thanh toán VNPay
 */
@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Getter
public class VNPayConfig {

    /**
     * Mã website của merchant trên hệ thống VNPay
     * VD: ZQXUI4I4
     */
    private String tmnCode;

    /**
     * Secret key để tạo secure hash (SHA256/SHA512)
     * QUAN TRỌNG: Không được public key này
     */
    private String hashSecret;

    /**
     * URL của VNPay Payment Gateway
     * Sandbox: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
     * Production: https://vnpayment.vn/paymentv2/vpcpay.html
     */
    private String paymentUrl;

    /**
     * URL callback sau khi khách hàng thanh toán xong
     * VNPay sẽ redirect về URL này với kết quả thanh toán
     */
    private String returnUrl;

    /**
     * Phiên bản API VNPay
     * Hiện tại: 2.1.0
     */
    private String version;

    /**
     * Mã lệnh API
     * Với thanh toán: "pay"
     */
    private String command;

    // Custom setters để trim trailing spaces
    public void setTmnCode(String tmnCode) {
        this.tmnCode = tmnCode != null ? tmnCode.trim() : null;
    }

    public void setHashSecret(String hashSecret) {
        this.hashSecret = hashSecret != null ? hashSecret.trim() : null;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl != null ? paymentUrl.trim() : null;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl != null ? returnUrl.trim() : null;
    }

    public void setVersion(String version) {
        this.version = version != null ? version.trim() : null;
    }

    public void setCommand(String command) {
        this.command = command != null ? command.trim() : null;
    }
}
