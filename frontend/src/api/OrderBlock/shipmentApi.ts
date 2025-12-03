import {BaseApi} from "../baseApi.ts";
import type {IServerResponse, IShipment} from "../../types";
import axiosClient from "../axiosClient.ts";

export class SupplierApi extends BaseApi<IShipment> {
    constructor() {
        super('admin/shipment');
    }


}

export const shipmentApi = new SupplierApi();