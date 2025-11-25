import { type ICartItem } from "../../types";

const CART_KEY = 'game_store_cart';

export const loadCartFromStorage = (): ICartItem[] => {
    try {
        const serializedState = localStorage.getItem(CART_KEY);
        if (serializedState === null) {
            return [];
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Lỗi khi tải giỏ hàng:", err);
        return [];
    }
};

export const saveCartToStorage = (items: ICartItem[]) => {
    try {
        const serializedState = JSON.stringify(items);
        localStorage.setItem(CART_KEY, serializedState);
    } catch (err) {
        console.error("Lỗi khi lưu giỏ hàng:", err);
    }
};