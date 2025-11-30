import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/ProductBlock/productSlice.ts';
import categoryReducer from './slices/ProductBlock/categorySlice.ts';
import supplierReducer from './slices/ProductBlock/supplierSilce.ts';
import authReducer from "./slices/Auth/authSlice.ts";


export const store = configureStore({
    reducer: {  
        cart: cartReducer,
        products: productReducer,
        categories: categoryReducer,
        suppliers: supplierReducer,
        auth: authReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;