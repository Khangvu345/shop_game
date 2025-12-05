import { BaseApi } from '../baseApi';
import axiosClient from '../axiosClient';
import type { IGoodsReceipt, ICreateGoodsReceiptPayload, IUpdateGoodsReceiptPayload, IServerResponse } from '../../types';

interface IGoodsReceiptListResponse {
    items: IGoodsReceipt[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
}

class GoodsReceiptApi extends BaseApi<IGoodsReceipt> {
    constructor() {
        super('admin/goods-receipts');
    }

    async getAllReceipts(params?: any): Promise<IGoodsReceiptListResponse> {
        const response = await axiosClient.get<IServerResponse<IGoodsReceiptListResponse>>(`/${this.resource}`, { params });
        return response.data.data;
    }

    async createReceipt(payload: ICreateGoodsReceiptPayload): Promise<IGoodsReceipt> {
        const response = await axiosClient.post<IServerResponse<IGoodsReceipt>>(`/${this.resource}`, payload);
        return response.data.data;
    }

    async updateReceipt(id: number, payload: IUpdateGoodsReceiptPayload): Promise<IGoodsReceipt> {
        const response = await axiosClient.put<IServerResponse<IGoodsReceipt>>(`/${this.resource}/${id}`, payload);
        return response.data.data;
    }
}

export const goodsReceiptApi = new GoodsReceiptApi();