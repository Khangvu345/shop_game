import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { goodsReceiptApi } from '../../../api/InventoryBlock/goodsReceiptApi';
import type { IGoodsReceipt, ICreateGoodsReceiptPayload, IUpdateGoodsReceiptPayload, IApiState } from '../../../types';

interface GoodsReceiptState extends IApiState<IGoodsReceipt[]> {
    currentReceipt: IGoodsReceipt | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

const initialState: GoodsReceiptState = {
    data: [],
    status: 'idle',
    error: null,
    currentReceipt: null,
    pagination: { page: 0, limit: 10, total: 0, totalPages: 0 }
};

export const fetchGoodsReceipts = createAsyncThunk(
    'goodsReceipts/fetchAll',
    async (params: { page?: number; size?: number; supplierId?: number } = {}, { rejectWithValue }) => {
        try {
            return await goodsReceiptApi.getAllReceipts(params);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchGoodsReceiptById = createAsyncThunk(
    'goodsReceipts/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await goodsReceiptApi.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk tạo mới
export const createGoodsReceipt = createAsyncThunk(
    'goodsReceipts/create',
    async (payload: ICreateGoodsReceiptPayload, { rejectWithValue }) => {
        try {
            return await goodsReceiptApi.createReceipt(payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateGoodsReceipt = createAsyncThunk(
    'goodsReceipts/update',
    async ({ id, payload }: { id: number; payload: IUpdateGoodsReceiptPayload }, { rejectWithValue }) => {
        try {
            return await goodsReceiptApi.updateReceipt(id, payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const goodsReceiptSlice = createSlice({
    name: 'goodsReceipts',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearCurrentReceipt: (state) => {
            state.currentReceipt = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch All
        builder.addCase(fetchGoodsReceipts.pending, (state) => { state.status = 'loading'; });
        builder.addCase(fetchGoodsReceipts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Map items vào data
            state.data = action.payload.items;
            state.pagination = {
                page: action.payload.currentPage,
                limit: action.payload.pageSize,
                total: action.payload.totalElements,
                totalPages: action.payload.totalPages
            };
        });

        builder.addCase(fetchGoodsReceiptById.fulfilled, (state, action) => {
            state.currentReceipt = action.payload;
        });

        builder.addCase(createGoodsReceipt.fulfilled, (state) => {
            state.status = 'succeeded';
        });
        builder.addCase(createGoodsReceipt.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });

        builder.addCase(updateGoodsReceipt.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentReceipt = action.payload;
        });
    },
});

export const { resetStatus, clearCurrentReceipt } = goodsReceiptSlice.actions;
export default goodsReceiptSlice.reducer;