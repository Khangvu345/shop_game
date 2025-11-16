export type TAccountProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
export type TAccountStatus = 'Active' | 'Locked' | 'Suspended';

export type TProductStatus = 'Active' | 'Inactive';
export type TReviewVisibility = 'Visible' | 'Hidden';
export type TModerationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Hidden';

export type TOrderStatus =
    | 'Draft'
    | 'Confirmed'
    | 'Paid'
    | 'Shipped'
    | 'Completed'
    | 'Cancelled';

export type TPaymentStatus =
    | 'Pending'
    | 'Authorized'
    | 'Captured'
    | 'Failed'
    | 'Refunded';

export type TShipmentStatus = 'Ready' | 'Shipped' | 'Delivered' | 'Returned';

export type TStockMovementReason =
    | 'GoodsReceipt'
    | 'Sale'
    | 'Return'
    | 'DamagedAdjustment'
    | 'StocktakeAdjustment'
    | 'ManualAdjustment';


