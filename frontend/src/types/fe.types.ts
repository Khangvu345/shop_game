import type {IProduct} from "./product.types";


// API
export interface IServerResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface IApiState<T> {
    data: T | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
}


// Local Storage
export interface ICartItem {
    product: IProduct;
    quantity: number;
}