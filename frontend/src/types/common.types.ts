// ENUM cho các bảng

// Account & Auth
export type TAccountProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
export type TAccountStatus = 'Active' | 'Locked' | 'Suspended';

// Product & Review
export type TProductStatus = 'Active' | 'Inactive';
export type TReviewVisibility = 'Visible' | 'Hidden';
export type TModerationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Hidden';

// Order Management
export type TOrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'RETURNED';

export type TPaymentMethod = 'COD' | 'VNPAY';

export type TPaymentStatus =
    | 'PENDING'
    | 'PAID'
    | 'COD_PENDING'
    | 'COD_COLLECTED'
    | 'FAILED'
    | 'REFUNDED';

export type TShipmentStatus = 'Ready' | 'Shipped' | 'Delivered' | 'Returned';

// Inventory
export type TStockMovementReason =
    | 'GoodsReceipt'
    | 'Sale'
    | 'Return'
    | 'DamagedAdjustment'
    | 'StocktakeAdjustment'
    | 'ManualAdjustment';
