import type { TStockMovementReason } from './common.types';
import type { ISupplier } from './product.types';

export interface IWarehouse {
    warehouse_id: string;
    name: string;
    address_text?: string;
}

export interface IStockMovement {
    movement_id: string;
    product_id: string;
    warehouse_id: string;
    quantity_delta: number;
    reason: TStockMovementReason;
    occurred_at: string;
    reference_no?: string;
    order_id?: string;
}

export interface IGoodsReceipt {
    receipt_id: string;
    supplier_id?: string;
    receipt_date: string;
    invoice_number?: string;
    total_cost?: number;
    notes?: string;

    supplier?: ISupplier;
    lines?: IGoodsReceiptLine[];
}

export interface IGoodsReceiptLine {
    receipt_id: string;
    line_no: number;
    product_id: string;
    warehouse_id: string;
    quantity_received: number;
    unit_cost?: number;
}