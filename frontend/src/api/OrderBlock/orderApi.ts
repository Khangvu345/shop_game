import {BaseApi} from "../baseApi.ts";
import type {IOrder, ICreateOrderPayload, IServerResponse, IPageResponse} from "../../types";
import axiosClient from "../axiosClient.ts";

export interface IOrderListResponse {
    content: IOrder[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
}

export interface ICancelOrderRequest {
    reason: string;
    cancelledBy: string;
}


export class OrderApi extends BaseApi<IOrder> {

    async placeOrder(payload: ICreateOrderPayload): Promise<IOrder> {
        const response = await axiosClient.post<IServerResponse<IOrder>>('/orders', payload);
        return response.data.data;
    }

    async getMyOrders(params: { page: number; size: number }): Promise<IOrderListResponse> {
        const response = await axiosClient.get<IOrderListResponse>('/orders/my-orders', { params });
        return response.data;
    }

    async getOrderDetail(orderId: number | string): Promise<IOrder> {
        const response = await axiosClient.get<IOrder>(`/orders/${orderId}`);
        console.log(response)
        return response.data;
    }

    async cancelOrder(orderId: number | string, payload: ICancelOrderRequest): Promise<IOrder> {
        const response = await axiosClient.post<IOrder>(`/orders/${orderId}/cancel`, payload);
        return response.data;
    }

}

export const orderApi = new OrderApi('orders');