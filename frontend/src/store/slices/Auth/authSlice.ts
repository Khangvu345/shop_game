import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../../api/authApi';
import type { IAuthUser, ILoginPayload, ILoginResponse } from '../../../types';

interface AuthState {
    user: IAuthUser | null; // Thông tin user (không kèm token)
    token: string | null;   // Token dùng để gọi API
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const storedToken = localStorage.getItem('access_token');
const storedUser = localStorage.getItem('user_data');

const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    status: 'idle',
    error: null,
};

// --- THUNKS ---

export const loginUser = createAsyncThunk(
    'auth/login',
    async (payload: ILoginPayload, { rejectWithValue }) => {
        try {
            // Gọi API, kết quả trả về khớp với ILoginResponse
            const data: ILoginResponse = await authApi.login(payload);

            // Bóc tách dữ liệu
            const { token, ...userInfo } = data; // Tách token ra khỏi user info

            // 1. Lưu Token
            localStorage.setItem('access_token', token);

            // 2. Lưu User Info (không chứa token) để hiển thị tên, role...
            localStorage.setItem('user_data', JSON.stringify(userInfo));

            // Trả về dữ liệu đầy đủ cho reducer xử lý
            return data;
        } catch (error: any) {
            // Xử lý lỗi từ Interceptor hoặc lỗi mạng
            return rejectWithValue(error.message || 'Đăng nhập thất bại');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (accountId: number | undefined) => {
        try {
            if (accountId) {
                await authApi.logout(accountId);
            }
        } catch (error) {
            console.warn(error);
        } finally {
            // Luôn xóa sạch dữ liệu ở Client
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
        }
    }
);

// --- SLICE ---

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducer đồng bộ để force logout nếu token hết hạn (dùng ở axios interceptor)
        forceLogout: (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
        }
    },
    extraReducers: (builder) => {
        // Xử lý Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<ILoginResponse>) => {
                state.status = 'succeeded';

                // Bóc tách lại một lần nữa để lưu vào state
                const { token, ...userInfo } = action.payload;

                state.token = token;
                state.user = userInfo; // User giờ đã có accountId, role... chuẩn
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Xử lý Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
        });
        // Kể cả logout lỗi mạng cũng xóa state
        builder.addCase(logoutUser.rejected, (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
        });
    },
});

export const { forceLogout } = authSlice.actions;
export default authSlice.reducer;