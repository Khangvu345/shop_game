import type { TStockMovementReason } from './common.types';
import type { ISupplier } from './product.types';

export interface IWarehouse {
    warehouseId: number;
    name: string;
    addressText?: string;
}

export interface IStockMovement {
    movementId: number;
    productId: number;
    warehouseId: number;
    quantityDelta: number; // Số âm (bán) hoặc dương (nhập)
    reason: TStockMovementReason;
    occurredAt: string;
    referenceNo?: string;
    orderId?: number;

    productName?: string;
    warehouseName?: string;
}

export interface IGoodsReceipt {
    receiptId: number;
    supplierId?: number;
    receiptDate: string;
    invoiceNumber?: string;
    totalCost?: number;
    notes?: string;

    supplier?: ISupplier;
    lines?: IGoodsReceiptLine[];
}

export interface IGoodsReceiptLine {
    receiptId: number;
    lineNo: number;
    productId: number;
    warehouseId: number;
    quantityReceived: number;
    unitCost?: number;
}