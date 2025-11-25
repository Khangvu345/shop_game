import type { IProduct } from '../types';
import axiosClient from './axiosClient';
import {data} from "react-router-dom";

export const productApi = {
    getAll: async (): Promise<IProduct[]> => {
        const response = await axiosClient.get('/products');
        const  returnData = response.data.data;
        console.log(returnData)
        return returnData;
    },
    getById: async (id: string): Promise<IProduct> => {
        const response = await axiosClient.get(`/products/${id}`);
        return response.data;
    },
};