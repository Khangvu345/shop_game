import type { IProduct } from '../types';
import axiosClient from './axiosClient';

export const productApi = {
    getAll: async (): Promise<IProduct[]> => {
        const response = await axiosClient.get('/products');
        const  returnData = response.data.data;
        console.log(returnData)
        return returnData;
    },
    getById: async (id: string): Promise<IProduct> => {
        const response = await axiosClient.get(`/products/${id}`);
        const returnData = response.data.data;
        console.log('Product detail:', returnData);
        return returnData;
    },
};