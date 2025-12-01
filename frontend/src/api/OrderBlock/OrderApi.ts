import {BaseApi} from "../baseApi.ts";
import type { IOrder, ICreateOrderPayload, IServerResponse } from "../../types";
import axiosClient from "../axiosClient.ts";

export class OrderApi extends BaseApi<IOrder> {

    async placeOrder(payload: ICreateOrderPayload): Promise<IOrder> {
        const response = await axiosClient.post<IServerResponse<IOrder>>('/orders', payload);
        return response.data.data;
    }


}

export const orderApi = new OrderApi('order');