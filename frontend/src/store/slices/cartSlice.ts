
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {type ICartItem, type IProduct } from '../../types';
import { loadCartFromStorage } from '../../utils/localStorage/Cart';

interface CartState {
    items: ICartItem[];
}

const initialState: CartState = {
    items: loadCartFromStorage(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<IProduct>) => {
            const product = action.payload;
            const existingItem = state.items.find(
                // SỬA: dùng productId
                (item) => item.product.productId === product.productId
            );
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ product: product, quantity: 1 });
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                (item) => item.product.productId !== action.payload
            );
        },
        updateQuantity: (state, action: PayloadAction<{ productId: number, quantity: number }>) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find((i) => i.product.productId === productId);
            if (item) {
                item.quantity = quantity;
                if (item.quantity < 1) {
                    state.items = state.items.filter((i) => i.product.productId !== productId);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;