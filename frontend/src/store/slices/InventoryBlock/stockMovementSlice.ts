import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockMovementApi } from '../../../api/InventoryBlock/stockMovementApi';
import type { IStockMovement, IStockMovementFilter, IApiState } from '../../../types';

interface StockMovementState extends IApiState<IStockMovement[]> {
    filter: IStockMovementFilter;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

const today = new Date();
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 7);

const initialState: StockMovementState = {
    data: [],
    status: 'idle',
    error: null,
    filter: {
        page: 0,
        size: 20,
        startDate: sevenDaysAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        reason: ''
    },
    pagination: { page: 0, limit: 20, total: 0, totalPages: 0 }
};

export const fetchStockMovements = createAsyncThunk(
    'stockMovements/fetch',
    async (filter: IStockMovementFilter, { rejectWithValue }) => {
        try {
            if (filter.productId) {
                return await stockMovementApi.getByProduct(filter.productId, filter.page, filter.size);
            }

            if (filter.reason) {
                return await stockMovementApi.getByReason(filter.reason, filter.page, filter.size);
            }


            const start = filter.startDate || new Date().toISOString().split('T')[0];
            const end = filter.endDate || new Date().toISOString().split('T')[0];
            return await stockMovementApi.getByDateRange(start, end, filter.page, filter.size);

        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const stockMovementSlice = createSlice({
    name: 'stockMovements',
    initialState,
    reducers: {
        setStockFilter: (state, action) => {
            state.filter = { ...state.filter, ...action.payload };
        },
        resetStockFilter: (state) => {
            state.filter = initialState.filter;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockMovements.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchStockMovements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.content;
                state.pagination = {
                    page: action.payload.currentPage,
                    limit: action.payload.pageSize,
                    total: action.payload.totalElements,
                    totalPages: action.payload.totalPages
                };
            })
            .addCase(fetchStockMovements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { setStockFilter, resetStockFilter } = stockMovementSlice.actions;
export default stockMovementSlice.reducer;