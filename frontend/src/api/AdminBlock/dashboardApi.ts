import axiosClient from '../axiosClient';
import type { IServerResponse } from '../../types';
import type { IDashboardStats, IDashboardFilter } from '../../types/dashboard.types';

export const dashboardApi = {
    getStats: async (params?: IDashboardFilter) => {
        const response = await axiosClient.get<IServerResponse<IDashboardStats>>('/admin/dashboard/stats', { params });
        return response.data.data;
    }
};