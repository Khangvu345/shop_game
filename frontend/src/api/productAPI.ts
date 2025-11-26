import type {IProduct} from '../types';
import axiosClient from './axiosClient';

export const productApi = {
    getAll: async (): Promise<IProduct[]> => {
        const response = await axiosClient.get('/products');
        return response.data.data;
    },
    getById: async (id: string): Promise<IProduct> => {
        const response = await axiosClient.get(`/products/${id}`);
        const returnData = response.data.data;
        console.log('Product detail:', returnData);
        return returnData;
    },

    addNew: async (product: Partial<IProduct>): Promise<IProduct> => {
        const response = await axiosClient.post('/products', product);
        return response.data.data;
    },

    update: async (id: number | string, product: Partial<IProduct>): Promise<IProduct> => {
        const response = await axiosClient.put(`/products/${id}`, product);
        return response.data.data;
    },
    delete: async (id: number | string): Promise<void> => {
        await axiosClient.delete(`/products/${id}`);
    },

};