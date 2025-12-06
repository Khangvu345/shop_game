import { createAsyncThunk } from "@reduxjs/toolkit";
import { shipmentApi } from "../../../api/OrderBlock/shipmentApi.ts";
import type { IShipment, IUpdateShipmentStatusPayload } from "../../../types";
import { createGenericSlice } from '../GenericSlice.ts';

// 1. Tạo Thunk Update Status riêng
export const updateShipmentStatus = createAsyncThunk(
    'shipments/updateStatus',
    async ({ id, payload }: { id: number, payload: IUpdateShipmentStatusPayload }, { rejectWithValue }) => {
        try {
            return await shipmentApi.updateStatus(id, payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. Sử dụng Generic Slice cho các thao tác cơ bản (Fetch All, Create)
const shipmentSlice = createGenericSlice(
    'shipments',
    shipmentApi,
    "shipmentId"
);

// 3. Mở rộng reducer của Generic Slice để xử lý updateStatus
const shipmentReducer = (state: any, action: any) => {
    // Gọi reducer gốc trước
    const newState = shipmentSlice.reducer(state, action);

    // Xử lý thêm logic cho updateStatus
    if (action.type === updateShipmentStatus.fulfilled.type) {
        // Cập nhật item trong danh sách data
        const updatedItem = action.payload as IShipment;
        if (newState.data) {
            const index = newState.data.findIndex((item: IShipment) => item.shipmentId === updatedItem.shipmentId);
            if (index !== -1) {
                newState.data[index] = updatedItem;
            }
        }
        newState.status = 'succeeded';
    }

    return newState;
};

// Export Actions
export const {
    fetchAll: fetchShipments,
    create: createShipment,
    // update: updateShipment // Không dùng update thường, dùng updateShipmentStatus ở trên
} = shipmentSlice.actions;

// Export Reducer custom
export default shipmentReducer;