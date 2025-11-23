import {createAsyncThunk, type PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import type {IApiState, IProduct, IProductFilters} from '../../types';
import {productApi} from '../../api/productAPI';
import { type RootState } from '../store';

interface ProductState extends IApiState<IProduct[]> {
    selectedProduct: IApiState<IProduct>;
    filters: IProductFilters;
}

const initialState: ProductState = {
    data: [],
    status: 'idle',
    error: null,
    selectedProduct: {
        data: null,
        status: 'idle',
        error: null,
    },

    filters:{
        categoryIds:[],
        priceRange:'all',
        status:'all',
        sortBy: 'default',
    },
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        return await productApi.getAll();
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id: string) => {
        return await productApi.getById(id);
    }
);



const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<IProductFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchProductById.pending, (state) => {
                state.selectedProduct.status = 'loading';
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.selectedProduct.status = 'succeeded';
                state.selectedProduct.data = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.selectedProduct.status = 'failed';
                state.selectedProduct.error = action.error.message;
            });
    },
});


const selectAllProducts = (state: RootState) => state.products.data;
const selectFilters = (state: RootState) => state.products.filters;

export const selectFilteredProducts = createSelector(
    [selectAllProducts, selectFilters],
    (products, filters) => {
        if (!products) return [];

        const filtered = products.filter((product) => {
            if (filters.categoryIds.length > 0) {
                if (!filters.categoryIds.includes(product.category_id)) return false;
            }

            if (filters.priceRange !== 'all') {
                const p = product.list_price;
                switch (filters.priceRange) {
                    case 'under-1m': if (p >= 1000000) return false; break;
                    case '1m-5m': if (p < 1000000 || p >= 5000000) return false; break;
                    case '5m-10m': if (p < 5000000 || p >= 10000000) return false; break;
                    case 'above-10m': if (p < 10000000) return false; break;
                }
            }

            return true;
        });
        const sorted = [...filtered];

        switch (filters.sortBy) {
            case 'price-asc': // Giá thấp đến cao
                sorted.sort((a, b) => a.list_price - b.list_price);
                break;
            case 'price-desc': // Giá cao đến thấp
                sorted.sort((a, b) => b.list_price - a.list_price);
                break;
            default: // Mặc định (giữ nguyên thứ tự từ API hoặc theo ngày tạo)
                break;
        }

        return sorted;
    }



);

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
