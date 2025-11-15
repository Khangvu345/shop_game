import type {IProduct} from "./product.types";

export interface IApiState<T> {
    data: T | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
}

export interface ICartItem {
    product: IProduct;
    quantity: number;
}