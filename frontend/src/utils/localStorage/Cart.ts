import type { ICartItem } from "../../types";

const CART_KEY = 'cartItems';

/**
 * Hàm tải giỏ hàng từ Local Storage
 */
export const loadCartState = (): ICartItem[] => {
    try {
        const serializedState = localStorage.getItem(CART_KEY);
        if (serializedState === null) {
            return []; // Không có gì trong giỏ
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Không thể tải giỏ hàng từ Local Storage:", err);
        return [];
    }
};

/**
 * Hàm lưu giỏ hàng vào Local Storage
 */
export const saveCartState = (items: ICartItem[]) => {
    try {
        const serializedState = JSON.stringify(items);
        localStorage.setItem(CART_KEY, serializedState);
    } catch (err) {
        console.error("Không thể lưu giỏ hàng vào Local Storage:", err);
    }
};