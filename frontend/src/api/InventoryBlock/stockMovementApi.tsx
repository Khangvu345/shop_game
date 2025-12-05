import { BaseApi } from '../baseApi';
import axiosClient from '../axiosClient';
import type { IStockMovement, IStockMovementFilter, IServerResponse, IPageResponse } from '../../types';

class StockMovementApi extends BaseApi<IStockMovement> {
    constructor() {
        super('admin/stock-movements');
    }

    async getByProduct(productId: number, page: number, size: number): Promise<IPageResponse<IStockMovement>> {
        const response = await axiosClient.get<IServerResponse<IPageResponse<IStockMovement>>>(
            `/${this.resource}/product/${productId}`,
            { params: { page, size } }
        );
        return response.data.data;
    }

    async getByDateRange(startDate: string, endDate: string, page: number, size: number): Promise<IPageResponse<IStockMovement>> {
        const startDateTime = `${startDate} 00:00:00`;
        const endDateTime = `${endDate} 23:59:59`;

        const response = await axiosClient.get<IServerResponse<IPageResponse<IStockMovement>>>(
            `/${this.resource}/filter/date-range`,
            { params: { startDate: startDateTime, endDate: endDateTime, page, size } }
        );
        return response.data.data;
    }

    async getByReason(reason: string, page: number, size: number): Promise<IPageResponse<IStockMovement>> {
        const response = await axiosClient.get<IServerResponse<IPageResponse<IStockMovement>>>(
            `/${this.resource}/filter/reason`,
            { params: { reason, page, size } }
        );
        return response.data.data;
    }
}

export const stockMovementApi = new StockMovementApi();