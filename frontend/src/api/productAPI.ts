import type { IProduct } from '../types';
import axiosClient from './axiosClient';

export const productApi = {
    getAll: async (): Promise<IProduct[]> => {
        const response = await axiosClient.get('/products'); //
        return response.data;
    },
    getById: async (id: string): Promise<IProduct> => {
        const response = await axiosClient.get(`/products/${id}`); //
        return response.data;
    },
};