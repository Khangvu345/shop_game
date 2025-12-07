package com.gameshop.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * VNPay Utility Class
 * Các hàm tiện ích để tích hợp với VNPay Payment Gateway
 */
public class VNPayUtil {

    /**
     * Tạo HMAC SHA512 hash
     * Sử dụng để tạo chữ ký bảo mật (secure hash) cho VNPay
     * 
     * @param key  Secret key được VNPay cung cấp
     * @param data Dữ liệu cần hash
     * @return Chuỗi hash dạng hex
     */
    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] hashBytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Convert byte array to hex string
            StringBuilder result = new StringBuilder();
            for (byte b : hashBytes) {
                result.append(String.format("%02x", b));
            }
            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA512", e);
        }
    }

    /**
     * Build query string từ map parameters
     * Tự động URL encode các giá trị
     * 
     * @param params Map các tham số
     * @return Query string đã được URL encoded
     */
    public static String buildQueryString(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames); // Sắp xếp theo alphabet

        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                try {
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    if (itr.hasNext()) {
                        query.append('&');
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Error encoding query string", e);
                }
            }
        }

        return query.toString();
    }

    /**
     * Build hash data từ map parameters
     * Dùng để tạo secure hash, KHÔNG URL encode
     * 
     * @param params Map các tham số
     * @return Hash data string (chưa hash, chỉ concat params)
     */
    public static String buildHashData(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames); // Sắp xếp theo alphabet

        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                try {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Error building hash data", e);
                }
            }
        }

        return hashData.toString();
    }

    /**
     * Tạo số ngẫu nhiên
     * Dùng làm vnp_TxnRef (mã tham chiếu giao dịch)
     * 
     * @param length Độ dài số ngẫu nhiên
     * @return Số ngẫu nhiên dạng string
     */
    public static String getRandomNumber(int length) {
        Random random = new Random();
        StringBuilder number = new StringBuilder();
        for (int i = 0; i < length; i++) {
            number.append(random.nextInt(10));
        }
        return number.toString();
    }
}
