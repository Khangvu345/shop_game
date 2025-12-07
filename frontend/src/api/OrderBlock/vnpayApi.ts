import {BaseApi} from "../baseApi.ts";
import axiosClient from "../axiosClient.ts";


export interface paymentPayload{
    orderId: string,
    bankCode: string,
    language: string
}

export interface paymentResponse{
    paymentUrl: string
    orderId: string,
    txnRef?: string,
    amount: number,
    createdAt?: string
}



class paymentApi extends BaseApi<paymentResponse> {
    async createPpayment(payload: paymentPayload ): Promise<paymentResponse> {
        const response = await axiosClient.post<paymentResponse>(`/${this.resource}`, payload);
        return response.data;
    }
}

export const vnpayApi = new paymentApi('payments/vnpay')