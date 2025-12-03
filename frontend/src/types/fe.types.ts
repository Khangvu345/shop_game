import type {IProduct} from "./product.types";


// API
export interface IServerResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
    error?: string;
}

export interface IPageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
}

export interface IApiState<T> {
    data: T | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
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

export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'date'| 'image';

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

