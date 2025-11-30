import axiosClient from './axiosClient';
import type {ILoginPayload, IServerResponse, ILoginResponse} from '../types';

export const authApi = {
    login: async (payload: ILoginPayload) => {
        const response = await axiosClient.post<IServerResponse<ILoginResponse>>('/auth/login', payload);
        return response.data.data;

    },

    logout: async (accountId : string | number) => {
        const response = await axiosClient.post('/auth/logout', { accountId });
        return response.data;
    }

};