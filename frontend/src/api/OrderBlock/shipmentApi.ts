import { BaseApi } from "../baseApi";
import axiosClient from "../axiosClient";
import type {
    IShipment,
    IUpdateShipmentStatusPayload,
    IServerResponse, ICreateShipmentPayload
} from "../../types";

class ShipmentApi extends BaseApi<IShipment> {
    constructor() {
        super('admin/shipments');
    }

    // Override create để dùng payload đúng
    async createShipment(payload: ICreateShipmentPayload): Promise<IShipment> {
        const response = await axiosClient.post<IServerResponse<IShipment>>(`/${this.resource}`, payload);
        return response.data.data;
    }

    // Custom method cho update status
    async updateStatus(id: number, payload: IUpdateShipmentStatusPayload): Promise<IShipment> {
        const response = await axiosClient.put<IServerResponse<IShipment>>(`/${this.resource}/${id}/status`, payload);
        return response.data.data;
    }
}

export const shipmentApi = new ShipmentApi();