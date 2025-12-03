import { createSlice, createAsyncThunk, type PayloadAction, type Draft } from '@reduxjs/toolkit';
import { BaseApi } from '../../api/baseApi';
import { type IApiState, type IPageResponse } from '../../types'; // Nhớ import IPageResponse vừa tạo ở bước trước

// 1. Định nghĩa State chung có thêm Pagination
interface GenericState<T> extends IApiState<T[]> {
    selectedItem: T | null;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

// 2. Hàm Factory
export function createGenericSlice<T>(
    sliceName: string,
    api: BaseApi<T>,
    idKey: keyof T
) {

    // --- A. TỰ ĐỘNG TẠO THUNKS ---

    // SỬA: fetchAll nhận params (mặc định là object rỗng)
    const fetchAll = createAsyncThunk(
        `${sliceName}/fetchAll`,
        async (params: any = {}) => api.getAll(params)
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
        // Khởi tạo giá trị mặc định cho phân trang
        pagination: { page: 0, limit: 10, total: 0, totalPages: 0 }
    };

    const slice = createSlice({
        name: sliceName,
        initialState,
        reducers: {
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
            // 1. Fetch All - SỬA LOGIC QUAN TRỌNG NHẤT
            builder.addCase(fetchAll.pending, (state) => { state.status = 'loading'; });
            builder.addCase(fetchAll.fulfilled, (state, action) => {
                state.status = 'succeeded';

                // Ép kiểu payload về IPageResponse<T>
                // Vì BaseApi.getAll giờ trả về IPageResponse
                const pageResponse = action.payload as unknown as IPageResponse<T>;

                // Lấy mảng dữ liệu thực tế từ field 'content'
                state.data = pageResponse.content as Draft<T>[];

                // Lưu lại thông tin phân trang (để dùng cho UI phân trang nếu cần)
                state.pagination = {
                    page: pageResponse.currentPage,
                    limit: pageResponse.pageSize,
                    total: pageResponse.totalElements,
                    totalPages: pageResponse.totalPages
                };
            });
            builder.addCase(fetchAll.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

            // 2. Fetch By ID (Lấy chi tiết 1 item)
            builder.addCase(fetchById.pending, (state) => {
                state.status = 'loading';
            });
            builder.addCase(fetchById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedItem = action.payload as Draft<T>;
            });
            builder.addCase(fetchById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

            // 3. Create (Thêm vào đầu mảng)
            builder.addCase(create.fulfilled, (state, action) => {
                // Lưu ý: Với phân trang server, việc unshift này chỉ là tạm thời trên UI
                // Khi reload lại trang 1, nó sẽ load lại từ server.
                state.data?.unshift(action.payload as Draft<T>);
            });

            // 3. Update (Tìm và sửa trong mảng)
            builder.addCase(update.fulfilled, (state, action) => {
                const newItem = action.payload;
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