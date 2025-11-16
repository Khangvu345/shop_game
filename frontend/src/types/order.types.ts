import type {
    TOrderStatus,
    TPaymentStatus,
    TShipmentStatus,
} from './common.types';
import type { ICustomer } from './people.types';
import type { IProduct } from './product.types';

export interface IOrderAddress {
    order_id: string;
    receiver_name: string;
    receiver_phone: string;
    line1: string;
    line2?: string;
    district?: string;
    city: string;
    postal_code?: string;
}

export interface IOrderLine {
    order_id: string;
    line_no: number;
    product_id: string;
    quantity: number;
    unit_price_at_order: number;
    line_discount: number;
    line_total: number;


    product?: Pick<IProduct, 'product_id' | 'product_name' | 'sku' | 'description'>;
}

export interface IPayment {
    payment_id: string;
    order_id: string;
    method: string;
    amount: number;
    paid_at?: string;
    status: TPaymentStatus;
}

export interface IShipment {
    shipment_id: string;
    order_id: string;
    carrier?: string;
    tracking_no?: string;
    estimated_delivery?: string;
    shipped_at?: string;
    delivered_at?: string;
    status: TShipmentStatus;
}

export interface IOrder {
    order_id: string;
    customer_id: string;
    order_date: string;
    status: TOrderStatus;
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    shipping_fee: number;
    grand_total: number;
    notes?: string;


    order_lines: IOrderLine[]; // Quan trọng nhất
    payments?: IPayment[];
    shipments?: IShipment[];
    shipping_address?: IOrderAddress;
    billing_address?: IOrderAddress;
    customer?: Pick<ICustomer, 'party_id' | 'full_name' | 'email'>;
}