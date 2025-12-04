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