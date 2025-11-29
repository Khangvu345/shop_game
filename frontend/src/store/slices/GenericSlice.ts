// src/store/utils/createGenericSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction,type Draft } from '@reduxjs/toolkit';
import { BaseApi } from '../../api/baseApi';
import { type IApiState } from '../../types';

// 1. Định nghĩa State chung
interface GenericState<T> extends IApiState<T[]> {
    // Có thể thêm item đang chọn để sửa/xem chi tiết
    selectedItem: T | null;
}

// 2. Hàm Factory
// T: Kiểu dữ liệu (ví dụ ICategory)
// api: Instance của BaseApi (ví dụ categoryApi)
// sliceName: Tên slice (ví dụ 'categories')
// idKey: Tên trường ID (ví dụ 'categoryId' hay 'productId')
export function createGenericSlice<T>(
    sliceName: string,
    api: BaseApi<T>,
    idKey: keyof T // Cần biết trường nào là ID để Update/Delete
){

    // --- A. TỰ ĐỘNG TẠO THUNKS ---

    const fetchAll = createAsyncThunk(
        `${sliceName}/fetchAll`,
        async () => api.getAll()
    );

    const fetchById = createAsyncThunk(
        `${sliceName}/fetchById`,
        async (id: number | string) => api.getById(id)
    );

    const create = createAsyncThunk(
        `${sliceName}/create`,
        async (data: Partial<T>) => api.create(data)
    );

    const update = createAsyncThunk(
        `${sliceName}/update`,
        async ({ id, data }: { id: number | string; data: Partial<T> }) =>
            api.update(id, data)
    );

    const remove = createAsyncThunk(
        `${sliceName}/remove`,
        async (id: number | string) => {
            await api.delete(id);
            return id;
        }
    );

    // --- B. TẠO SLICE ---

    const initialState: GenericState<T> = {
        data: [],
        status: 'idle',
        error: null,
        selectedItem: null,
    };

    const slice = createSlice({
        name: sliceName,
        initialState,
        reducers: {
            // Các action đồng bộ (nếu cần)
            resetState: (state) => {
                state.status = 'idle';
                state.error = null;
                state.selectedItem = null;
            },
            setSelectedItem: (state, action: PayloadAction<T | null>) => {
                state.selectedItem = action.payload as Draft<T>;
            }
        },
        extraReducers: (builder) => {
            // 1. Fetch All
            builder.addCase(fetchAll.pending, (state) => { state.status = 'loading'; });
            builder.addCase(fetchAll.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload as Draft<T>[];
            });
            builder.addCase(fetchAll.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

            // 2. Create (Thêm vào đầu mảng)
            builder.addCase(create.fulfilled, (state, action) => {
                state.data?.unshift(action.payload as Draft<T>);
            });

            // 3. Update (Tìm và sửa trong mảng)
            builder.addCase(update.fulfilled, (state, action) => {
                const newItem = action.payload;
                // Tìm index dựa trên idKey truyền vào
                const index = state.data?.findIndex(
                    (item) => String((item as never)[idKey]) === String(newItem[idKey])
                );
                if (index !== undefined && index !== -1 && state.data) {
                    state.data[index] = newItem as Draft<T>;
                }
            });

            // 4. Delete (Lọc khỏi mảng)
            builder.addCase(remove.fulfilled, (state, action) => {
                if (state.data) {
                    state.data = state.data.filter(
                        (item) => String((item as never)[idKey]) !== String(action.payload)
                    ) as Draft<T>[];
                }
            });
        },
    });

    // --- C. TRẢ VỀ KẾT QUẢ ---
    return {
        reducer: slice.reducer,
        actions: { ...slice.actions, fetchAll, fetchById, create, update, remove },
    };
}