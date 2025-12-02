import type {IOrder, ICreateOrderPayload, IApiState} from "../../../types";
import {orderApi} from "../../../api/OrderBlock/OrderApi.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

interface OrderState extends IApiState<IOrder[]> {
    currentOrder: IOrder | null;
}

const initialState: OrderState = {
    data: [],
    status: 'idle',
    error: null,
    currentOrder: null,
};

export const placeOrder = createAsyncThunk(
    'orders/create', // Tên action
    async (payload: ICreateOrderPayload, { rejectWithValue }) => {
        try {
            const response = await orderApi.placeOrder(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);



const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.status = 'idle';
            state.currentOrder = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => { state.status = 'loading'; })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOrder = action.payload;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer