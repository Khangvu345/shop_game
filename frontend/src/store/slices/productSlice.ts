import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {IApiState, IProduct} from '../../types';
import {productApi} from '../../api/productAPI';

interface ProductState extends IApiState<IProduct[]> {
    selectedProduct: IApiState<IProduct>;
}

const initialState: ProductState = {
    data: [],
    status: 'idle',
    error: null,
    selectedProduct: {
        data: null,
        status: 'idle',
        error: null,
    }
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
    reducers: {},
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
            // Xử lý fetchProductById
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

export default productSlice.reducer;