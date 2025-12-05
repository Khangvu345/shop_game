import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi } from '../../../api/AccountBlock/customerApi';
import type {
    ICustomerProfile,
    ICustomerListItem,
    IAddressResponse,
    IUpdateProfilePayload,
    IChangePasswordPayload,
    ISaveAddressPayload,
    IAdminCustomerFilter,
    IApiState
} from '../../../types';

interface CustomerState {
    // State cho User đang đăng nhập
    profile: IApiState<ICustomerProfile>;
    address: IApiState<IAddressResponse>;

    // State cho Admin quản lý
    adminList: {
        data: ICustomerListItem[];
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

const initialState: CustomerState = {
    profile: { data: null, status: 'idle', error: null },
    address: { data: null, status: 'idle', error: null },
    adminList: {
        data: [],
        pagination: { page: 0, limit: 10, total: 0, totalPages: 0 },
        status: 'idle',
        error: null
    }
};

// --- THUNKS FOR USER ---
export const fetchMyProfile = createAsyncThunk(
    'customer/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try { return await customerApi.getProfile(); }
        catch (err: any) { return rejectWithValue(err.message); }
    }
);

export const updateMyProfile = createAsyncThunk(
    'customer/updateMyProfile',
    async (payload: IUpdateProfilePayload, { rejectWithValue }) => {
        try { return await customerApi.updateProfile(payload); }
        catch (err: any) { return rejectWithValue(err.message); }
    }
);

export const fetchMyAddress = createAsyncThunk(
    'customer/fetchMyAddress',
    async (_, { rejectWithValue }) => {
        try { return await customerApi.getDefaultAddress(); }
        catch (err: any) { return rejectWithValue(err.message); }
    }
);

export const saveMyAddress = createAsyncThunk(
    'customer/saveMyAddress',
    async (payload: ISaveAddressPayload, { rejectWithValue }) => {
        try { return await customerApi.saveAddress(payload); }
        catch (err: any) { return rejectWithValue(err.message); }
    }
);

export const changeMyPassword = createAsyncThunk(
    'customer/changePassword',
    async (payload: IChangePasswordPayload, { rejectWithValue }) => {
        try {
            await customerApi.changePassword(payload);
            return true;
        }
        catch (err: any) { return rejectWithValue(err.message); }
    }
);

// --- THUNKS FOR ADMIN ---
export const fetchCustomers = createAsyncThunk(
    'customer/fetchAll',
    async (params: IAdminCustomerFilter, { rejectWithValue }) => {
        try { return await customerApi.getAllCustomers(params); }
        catch (err: any) { return rejectWithValue(err.message); }
    }
);

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // 1. Profile
        builder.addCase(fetchMyProfile.pending, (state) => { state.profile.status = 'loading'; });
        builder.addCase(fetchMyProfile.fulfilled, (state, action) => {
            state.profile.status = 'succeeded';
            state.profile.data = action.payload;
        });
        builder.addCase(updateMyProfile.fulfilled, (state, action) => {
            state.profile.data = action.payload; // Cập nhật data mới
        });

        // 2. Address
        builder.addCase(fetchMyAddress.fulfilled, (state, action) => {
            state.address.data = action.payload;
        });
        builder.addCase(saveMyAddress.fulfilled, (state, action) => {
            state.address.data = action.payload;
        });

        // 3. Admin List
        builder.addCase(fetchCustomers.pending, (state) => { state.adminList.status = 'loading'; });
        builder.addCase(fetchCustomers.fulfilled, (state, action) => {
            state.adminList.status = 'succeeded';
            state.adminList.data = action.payload.content;
            state.adminList.pagination = {
                page: action.payload.currentPage,
                limit: action.payload.pageSize,
                total: action.payload.totalElements,
                totalPages: action.payload.totalPages
            };
        });
    }
});

export default customerSlice.reducer;