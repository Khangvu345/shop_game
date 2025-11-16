import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ICartItem, IProduct } from '../../types';

interface CartState {
    items: ICartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<IProduct>) => {
            const product = action.payload;
            const existingItem = state.items.find(
                (item) => item.product.product_id === product.product_id
            );
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ product: product, quantity: 1 });
            }
        },
        removeItem: (state, action: PayloadAction<string>) => { // payload là productId
            state.items = state.items.filter(
                (item) => item.product.product_id !== action.payload
            );
        },
    },
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;