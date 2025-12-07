package com.gameshop.model.dto.common;

import lombok.Data;

/**
 * DTO để parse VNPay callback parameters
 * VNPay sẽ gửi các tham số này qua URL callback
 */
@Data
public class VNPayCallbackDTO {

    private String vnp_TmnCode; // Mã website
    private String vnp_Amount; // Số tiền thanh toán (x100)
    private String vnp_BankCode; // Mã ngân hàng
    private String vnp_BankTranNo; // Mã giao dịch tại ngân hàng
    private String vnp_CardType; // Loại thẻ (ATM, QRCODE, etc.)
    private String vnp_OrderInfo; // Thông tin đơn hàng
    private String vnp_PayDate; // Ngày thanh toán (yyyyMMddHHmmss)
    private String vnp_ResponseCode; // Mã phản hồi (00 = thành công)
    private String vnp_TransactionNo; // Mã giao dịch VNPay
    private String vnp_TransactionStatus; // Trạng thái giao dịch
    private String vnp_TxnRef; // Mã tham chiếu giao dịch
    private String vnp_SecureHash; // Chữ ký bảo mật
}
