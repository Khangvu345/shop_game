package com.gameshop.model.enums;

/**
 * Enum Role - Vai trò người dùng trong hệ thống
 */
public enum Role {
    /**
     * Quản trị viên - Full access tất cả chức năng
     * - Quản lý sản phẩm, danh mục
     * - Quản lý kho hàng, nhập hàng
     * - Xem báo cáo, thống kê
     * - Quản lý đơn hàng, khách hàng
     */
    ADMIN,

    /**
     * Khách hàng - Limited access
     * - Xem sản phẩm
     * - Đặt hàng
     * - Xem lịch sử đơn hàng của mình
     */
    CUSTOMER
}
