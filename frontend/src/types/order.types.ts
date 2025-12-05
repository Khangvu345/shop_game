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

    items?:IOrderItem[];

    subTotal: number;
    discountAmount?: number;
    taxAmount?: number;
    grandTotal: number;

    notes?: string;

    createdAt: string,
    updatedAt?: string,

    cancelledAt?: string;
    cancelReason?: string;
    cancelledBy?: string;

    customer?: ICustomer;
    address?: IShippingAddress;
    payments?: IPayment[];
    shipments?: IShipment[];
}
export interface IShippingAddress {
    recipientName: string,
    phone: string,
    street: string,
    ward: string,
    city: string
}

export interface IOrderItem {
    orderId?: number;
    lineNo?: number;
    productId: number;
    quantity: number;
    price: number;
    lineTotal: number;

    productName?: string;
    productSku?: string;
    thumbnailUrl?: string;
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
    shipmentId: number,
    orderId: number,
    carrier: string,
    trackingNo: string,
    estimatedDelivery: string,
    shippedAt: string,
    deliveredAt: string,
    "status": TShipmentStatus
}


export interface IOrderItemPayload {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    lineTotal: number;
}

export interface IOrderAddressPayload {
    recipientName: string;
    phone: string;
    street: string;
    ward: string;
    city: string;
}

export interface ICreateOrderPayload {
    paymentMethod: string;
    address: IOrderAddressPayload;
    items: IOrderItemPayload[];
}