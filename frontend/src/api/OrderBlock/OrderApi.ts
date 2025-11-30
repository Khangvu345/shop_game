import {BaseApi} from "../baseApi.ts";
import {type IOrder } from "../../types";

export class OrderApi extends BaseApi<IOrder> {
    constructor() {
        super('orders');
    }
}

export const orderApi = new OrderApi();