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



// Table & Form Configurations
export interface IColumn<T> {
    title: string;
    key: keyof T;
    render?: (item: T) => React.ReactNode;
}

export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'date';

export interface IFieldConfig<T> {
    name: keyof T;
    label: string;
    type: FieldType;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;

    options?: { label: string; value: string | number }[];
    colSpan?: 1 | 2;
}