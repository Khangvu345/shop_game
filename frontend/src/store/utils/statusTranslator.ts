const ORDER_STATUS_MAP: Record<string, string> = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    SHIPPED: "Đang giao hàng",
    DELIVERED: "Đã giao hàng",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
    RETURNED: "Trả hàng/Hoàn tiền",
};

const PAYMENT_STATUS_MAP: Record<string, string> = {
    PENDING: "Đợi thang toán",
    PAID: "Đã thanh toán",
    COD_PENDING:"Chưa thanh toán",
    COD_COLLECTED:"Đã thu COD",
    REFUNDED: "Đã hoàn tiền",
    FAILED: "Thanh toán lỗi",

};

const SHIPMENT_STATUS_MAP: Record<string, string> = {
    Ready: "Sẵn sàng giao hàng",
    Shipped: "Đang giao hàng",
    Delivered: "Giao thành công",
    Returned: "Đã hoàn",
};



/**
 * Hàm lấy tên tiếng Việt của trạng thái
 */
export const translateStatus = (
    status: string ,
    type: 'order' | 'payment' | 'shipment',
): string => {
    if (!status) return "Không xác định";

    let map;
    switch (type) {
        case 'payment':
            map = PAYMENT_STATUS_MAP;
            break;
        case 'shipment':
            map = SHIPMENT_STATUS_MAP;
            break;
        default:
            map = ORDER_STATUS_MAP;
    }

    return map[status] || status;
};

/**
 * Hàm lấy màu sắc (CSS class hoặc mã màu) cho Badge/Tag
 */
export const getStatusColor = (status: string | undefined): string => {
    if (!status) return "gray";

    switch (status) {
        case "Delivered":
        case "COMPLETED":
        case "DELIVERED":
        case "PAID":
        case "COD_COLLECTED":
            return "green";


        case "Shipped":
        case "CONFIRMED":
        case "SHIPPED":
        case "PREPARING":
            return "blue";

        case "Ready":
        case "PENDING":
        case "COD_PENDING":
            return "orange";


        case "Returned":
        case "CANCELLED":
        case "FAILED":
        case "RETURNED":
        case "DAMAGED":
        case "REFUNDED":
            return "red";

        default:
            return "gray";
    }
};