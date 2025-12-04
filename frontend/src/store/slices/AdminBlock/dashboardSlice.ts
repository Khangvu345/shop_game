import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { dashboardApi } from '../../../api/AdminBlock/dashboardApi';
import type { IDashboardStats, IDashboardFilter } from '../../../types/dashboard.types';

interface DashboardState {
    stats: IDashboardStats | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    filter: IDashboardFilter;
}

const currentDate = new Date();

const initialState: DashboardState = {
    stats: null,
    status: 'idle',
    error: null,
    filter: {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    }
};

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (filter: IDashboardFilter, { rejectWithValue }) => {
        try {
            return await dashboardApi.getStats(filter);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<IDashboardFilter>) => {
            state.filter = { ...state.filter, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { setFilter } = dashboardSlice.actions;
export default dashboardSlice.reducer;