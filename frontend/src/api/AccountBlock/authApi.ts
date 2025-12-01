import axiosClient from '../axiosClient.ts';
import type {ILoginPayload, IServerResponse, ILoginResponse, IAuthUser} from '../../types';

export const authApi = {
    login: async (payload: ILoginPayload) => {
        const response = await axiosClient.post<IServerResponse<ILoginResponse>>('/auth/login', payload);
        return response.data.data;

    },

    logout: async (accountId : string | number) => {
        const response = await axiosClient.post('/auth/logout', { accountId });
        return response.data;
    },

    validateToken: async (token: string) => {

        const response = await axiosClient.get<IServerResponse<IAuthUser>>('/auth/validate', {
            params: { token }
        });
        return response.data.data;
    }
};