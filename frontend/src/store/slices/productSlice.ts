import { createSlice, createAsyncThunk, type PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { IApiState, IProduct, IServerProductFilters, IProductFilters } from '../../types';
import { productApi } from '../../api/productApi'; // Instance của class ProductApi (kế thừa BaseApi)
import { type RootState } from '../store';

// 1. Định nghĩa State
interface ProductState extends IApiState<IProduct[]> {
    // State cho chi tiết 1 sản phẩm
    selectedProduct: IApiState<IProduct>;

    // State quản lý bộ lọc (Gửi lên Server)
    serverFilters: IServerProductFilters;

    // State quản lý hiển thị (Xử lý tại Client)
    clientFilters: IProductFilters;

}

const initialState: ProductState = {
    data: [],
    status: 'idle',
    error: null,
    selectedProduct: { data: null, status: 'idle', error: null },

    // Giá trị mặc định cho bộ lọc gửi lên server
    serverFilters: {},

    // Giá trị mặc định cho phân trang/sắp xếp client
    clientFilters: {
        page: 1,
        limit: 6,
        sortBy: 'default',
    },
};

// --- ASYNC THUNKS ---

// Gọi API lấy danh sách sản phẩm (có truyền tham số lọc)
export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (filters?: IServerProductFilters) => {
        // BaseApi.getAll đã hỗ trợ truyền params
        const response = await productApi.getAll(filters);
        return response;
    }
);

// Gọi API lấy chi tiết 1 sản phẩm
export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id: number | string) => {
        const response = await productApi.getById(id);
        return response;
    }
);

export const addProduct = createAsyncThunk(
    'products/add',
    async (data: Partial<IProduct>) => {
        const response = await productApi.create(data);
        return response;
    }
);

export const editProduct = createAsyncThunk(
    'products/edit',
    async ({ id, data }: { id: number | string; data: Partial<IProduct> }) => {
        const response = await productApi.update(id, data);
        return response;
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id: number | string) => {
        await productApi.delete(id);
        return id;
    }
);


const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // 1. Cập nhật bộ lọc Server -> Reset trang về 1
        setServerFilters: (state, action: PayloadAction<IServerProductFilters>) => {
            state.serverFilters = { ...state.serverFilters, ...action.payload };
            state.clientFilters.page = 1;
        },

        // 2. Đổi trang (Client)
        setPage: (state, action: PayloadAction<number>) => {
            state.clientFilters.page = action.payload;
        },

        // 3. Đổi sắp xếp (Client) -> Reset trang về 1
        setSort: (state, action: PayloadAction<IProductFilters['sortBy']>) => {
            state.clientFilters.sortBy = action.payload;
            state.clientFilters.page = 1;
        },

        // 4. Reset tất cả về mặc định
        resetProductState: (state) => {
            state.serverFilters = {};
            state.clientFilters = initialState.clientFilters;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        //GET
        builder
            // Fetch All
            .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Fetch By ID
            .addCase(fetchProductById.pending, (state) => { state.selectedProduct.status = 'loading'; })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.selectedProduct.status = 'succeeded';
                state.selectedProduct.data = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.selectedProduct.status = 'failed';
                state.selectedProduct.error = action.error.message;
            });
        // POST
        builder.addCase(addProduct.fulfilled, (state, action) => {
            if (state.data) state.data.unshift(action.payload);
        });
        // PUT
        builder.addCase(editProduct.fulfilled, (state, action) => {
            const index = state.data?.findIndex(p => p.productId === action.payload.productId);
            if (state.data && index !== undefined && index !== -1) {
                state.data[index] = action.payload;
            }
        });
        // DELETE
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            if (state.data) {
                state.data = state.data.filter(p => p.productId !== action.payload);
            }
        });



    },
});

export const { setServerFilters, setPage, setSort, resetProductState } = productSlice.actions;
export default productSlice.reducer;

// ============================================================
// SELECTOR: LOGIC HIỂN THỊ (Cập nhật theo tên biến mới)
// ============================================================

const selectAllData = (state: RootState) => state.products.data;
const selectclientFilters = (state: RootState) => state.products.clientFilters;

export const selectDisplayProducts = createSelector(
    [selectAllData, selectclientFilters],
    (products, config) => {
        if (!Array.isArray(products) || products.length === 0) {
            return { paginatedData: [], totalPages: 0, totalRows: 0 };
        }

        // 1. SẮP XẾP (Client-side)
        const sorted = [...products];
        switch (config.sortBy) {
            case 'price-asc':
                // Dùng 'listPrice' (camelCase)
                sorted.sort((a, b) => a.listPrice - b.listPrice);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.listPrice - a.listPrice);
                break;
            default:
                // Dùng 'productId' (camelCase)
                sorted.sort((a, b) => b.productId - a.productId);
                break;
        }

        // 2. PHÂN TRANG (Client-side)
        const totalRows = sorted.length;
        const totalPages = Math.ceil(totalRows / config.limit);
        const startIndex = (config.page - 1) * config.limit;
        const paginatedData = sorted.slice(startIndex, startIndex + config.limit);

        return { paginatedData, totalPages, totalRows };
    }
);