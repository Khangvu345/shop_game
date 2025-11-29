import type {
    TOrderStatus,
    TPaymentMethod,
    TPaymentStatus,
    TShipmentStatus
} from './common.types';

import type {ICustomer} from "./people.types.ts";

export interface IOrder {
    orderId: number;
    customerId: number;
    orderDate: string;
    status: TOrderStatus;
    paymentMethod: TPaymentMethod;
    paymentStatus: TPaymentStatus;

    subtotal: number;
    discountAmount?: number;
    taxAmount?: number;
    grandTotal?: number;

    notes?: string;

    cancelledAt?: string;
    cancelledReason?: string;
    cancelledBy?: string;

    customer?: ICustomer;
    orderLines?: IOrderLine[];
    orderAddress?: IOrderAddress;
    payments?: IPayment[];
    shipments?: IShipment[];
}
export interface IOrderLine {
    orderId: number;
    lineNo: number;
    productId: number;
    quantity: number;
    unitPriceAtOrder: number;
    lineTotal: number;

    productName?: string;
    productSku?: string;
    thumbnailUrl?: string;
}

export interface IOrderAddress {
    orderId: number;
    receiverName: string;
    receiverPhone: string;
    line1: string;
    line2?: string;
    district?: string;
    city: string;
    postalCode?: string;
}

export interface IPayment {
    paymentId: number;
    orderId: number;
    method: string;
    amount: number;
    paidAt?: string;
    status: TPaymentStatus;
}

export interface IShipment {
    shipmentId: number;
    orderId: number;
    carrier?: string;
    trackingNo?: string;
    estimatedDelivery?: string;
    shippedAt?: string;
    deliveredAt?: string;
    status: TShipmentStatus;
}
