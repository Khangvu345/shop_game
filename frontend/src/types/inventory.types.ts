import type { TStockMovementReason } from './common.types';
import type { ISupplier } from './product.types';

export interface IGoodsReceiptLineDto {
    productId: number;
    productName: string;
    quantityReceived: number;
    unitCost: number;
    lineTotal: number;
}

export interface IGoodsReceipt {
    receiptId: number;
    supplier: ISupplier; // Backend trả về object SupplierResponse
    invoiceNumber: string;
    totalCost: number;
    notes?: string;
    receiptDate: string;
    items: IGoodsReceiptLineDto[]; // Backend trả về field là items
}

export interface ICreateGoodsReceiptItem {
    productId: number;
    quantity: number;
    unitCost: number;
}

export interface ICreateGoodsReceiptPayload {
    supplierId: number;
    invoiceNumber: string;
    notes?: string;
    items: ICreateGoodsReceiptItem[];
}

export interface IUpdateGoodsReceiptPayload {
    invoiceNumber?: string;
    notes?: string;
    updateReason: string; // Bắt buộc
}


export interface IStockMovement {
    movementId: number;
    productId: number;
    productName: string;
    quantityDelta: number;
    reason: TStockMovementReason;
    referenceNo?: string; // Mã đơn hàng hoặc mã phiếu nhập
    orderId?: number;
    occurredAt: string; // ISO Date
}

export interface IStockMovementFilter {
    page: number;
    size: number;
    productId?: number;
    startDate?: string; // YYYY-MM-DD
    endDate?: string;   // YYYY-MM-DD
    reason?: TStockMovementReason | '';
}