import axiosClient from '../axiosClient';
import type {
    IServerResponse,
    IPageResponse,
    ICustomerProfile,
    ICustomerListItem,
    IAddressResponse,
    IUpdateProfilePayload,
    IChangePasswordPayload,
    ISaveAddressPayload,
    IAdminCustomerFilter
} from '../../types';

export const customerApi = {
    // --- USER ENDPOINTS ---
    getProfile: async () => {
        const response = await axiosClient.get<ICustomerProfile>('/customers/profile');
        return response.data;
    },

    updateProfile: async (payload: IUpdateProfilePayload) => {
        const response = await axiosClient.put<ICustomerProfile>('/customers/profile', payload);
        return response.data;
    },

    changePassword: async (payload: IChangePasswordPayload) => {
        const response = await axiosClient.put<IServerResponse<void>>('/customers/change-password', payload);
        return response.data;
    },

    getDefaultAddress: async () => {
        const response = await axiosClient.get<ICustomerProfile>('/customers/address');
        // Lưu ý: Backend trả về AddressResponse trực tiếp hoặc 204 No Content
        // Cần check kỹ nếu axiosClient interceptor đã xử lý wrap data
        return response.data as unknown as IAddressResponse;
    },

    saveAddress: async (payload: ISaveAddressPayload) => {
        const response = await axiosClient.put<IServerResponse<IAddressResponse>>('/customers/address', payload);
        return response.data.data;
    },

    // --- ADMIN ENDPOINTS ---
    getAllCustomers: async (params: IAdminCustomerFilter) => {
        const url = params.keyword ? '/customers/admin/search' : '/customers/admin/list';
        const response = await axiosClient.get<IPageResponse<ICustomerListItem>>(url, { params });
        return response.data;
    },

    getCustomerById: async (id: number) => {
        const response = await axiosClient.get<ICustomerProfile>(`/customers/admin/${id}`);
        return response.data;
    }
};