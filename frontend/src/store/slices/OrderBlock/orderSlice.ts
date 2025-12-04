import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    type IAdminOrderFilter,
    type ICancelOrderRequest,
    type IUpdateOrderStatusRequest,
    orderApi
} from "../../../api/OrderBlock/orderApi.ts";
import type { IOrder, ICreateOrderPayload, IApiState } from "../../../types";

interface OrderState extends IApiState<IOrder[]> {
    currentOrder: IOrder | null;

    myOrders: {
        data: IOrder[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | null;
    };

    adminOrders: {
        data: IOrder[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | null;
    }
}

const initialState: OrderState = {
    data: [],
    status: 'idle',
    error: null,
    currentOrder: null,
    myOrders: {
        data: [],
        pagination: { page: 0, limit: 5, total: 0, totalPages: 0 },
        status: 'idle',
        error: null
    },

    adminOrders: {
        data: [],
        pagination: { page: 0, limit: 10, total: 0, totalPages: 0 },
        status: 'idle',
        error: null
    }
};

// --- Thunk: Đặt hàng ---
export const placeOrder = createAsyncThunk(
    'orders/create',
    async (payload: ICreateOrderPayload, { rejectWithValue }) => {
        try {
            return await orderApi.placeOrder(payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (params: { page: number; size: number }, { rejectWithValue }) => {
        try {
            return await orderApi.getMyOrders(params);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchOrderDetail = createAsyncThunk(
    'orders/fetchDetail',
    async (id: number | string, { rejectWithValue }) => {
        try {
            return await orderApi.getOrderDetail(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelOrderThunk = createAsyncThunk(
    'orders/cancel',
    async ({ id, payload }: { id: number | string; payload: ICancelOrderRequest }, { rejectWithValue }) => {
        try {
            return await orderApi.cancelOrder(id, payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchAdminOrders = createAsyncThunk(
    'orders/fetchAdminOrders',
    async (filter: IAdminOrderFilter, { rejectWithValue }) => {
        try {
            return await orderApi.getAllOrders(filter);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAdminOrderDetail = createAsyncThunk(
    'orders/fetchAdminDetail',
    async (id: number | string, { rejectWithValue }) => {
        try {
            return await orderApi.getAdminOrderDetail(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. Cập nhật trạng thái
export const updateOrderStatusThunk = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, payload }: { id: number | string, payload: IUpdateOrderStatusRequest }, { rejectWithValue }) => {
        try {
            return await orderApi.updateStatus(id, payload);
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

        // Fetch My Orders logic (MỚI)
        builder
            .addCase(fetchMyOrders.pending, (state) => {
                state.myOrders.status = 'loading';
                state.myOrders.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.myOrders.status = 'succeeded';
                const response = action.payload;
                state.myOrders.data = response.content;
                state.myOrders.pagination = {
                    page: response.currentPage,
                    limit: response.pageSize,
                    total: response.totalElements,
                    totalPages: response.totalPages
                };
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.myOrders.status = 'failed';
                state.myOrders.error = action.payload as string;
            });


        builder.addCase(fetchOrderDetail.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(fetchOrderDetail.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentOrder = action.payload;
        });
        builder.addCase(fetchOrderDetail.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });


        builder.addCase(cancelOrderThunk.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(cancelOrderThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Cập nhật lại currentOrder với dữ liệu mới (đã hủy) từ server
            state.currentOrder = action.payload;

            // Cập nhật luôn trong danh sách myOrders nếu đang có
            const index = state.myOrders.data.findIndex(o => o.orderId === action.payload.orderId);
            if (index !== -1) {
                state.myOrders.data[index] = action.payload;
            }
        });
        builder.addCase(cancelOrderThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });

        builder.addCase(fetchAdminOrders.pending, (state) => {
            state.adminOrders.status = 'loading';
        });
        builder.addCase(fetchAdminOrders.fulfilled, (state, action) => {
            state.adminOrders.status = 'succeeded';
            state.adminOrders.data = action.payload.content;
            state.adminOrders.pagination = {
                page: action.payload.currentPage,
                limit: action.payload.pageSize,
                total: action.payload.totalElements,
                totalPages: action.payload.totalPages
            };
        });
        builder.addCase(fetchAdminOrders.rejected, (state, action) => {
            state.adminOrders.status = 'failed';
            state.adminOrders.error = action.payload as string;
        });

        builder.addCase(fetchAdminOrderDetail.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(fetchAdminOrderDetail.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentOrder = action.payload;
        });
        builder.addCase(fetchAdminOrderDetail.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });


        // --- Admin Update Status ---
        builder.addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
            state.currentOrder = action.payload; // Cập nhật chi tiết
            // Cập nhật trong danh sách nếu có
            const index = state.adminOrders.data.findIndex(o => o.orderId === action.payload.orderId);
            if (index !== -1) {
                state.adminOrders.data[index] = action.payload;
            }
        });
    },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;