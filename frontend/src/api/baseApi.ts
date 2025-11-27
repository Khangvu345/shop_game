import axiosClient from './axiosClient';
import type {IServerResponse} from "../types";

export class BaseApi<T, P = unknown> {
    protected readonly resource: string;

    constructor(resource: string) {
        this.resource = resource;
    }

    async getAll(params?: P): Promise<T[]> {
        const response = await axiosClient.get<IServerResponse<T[]>>(`/${this.resource}`, { params });
        console.log(response.data.data)
        return response.data.data;
    }

    async getById(id: string | number): Promise<T> {
        const response = await axiosClient.get<IServerResponse<T>>(`/${this.resource}/${id}`);
        return response.data.data;
    }

    async create(data: Partial<T>): Promise<T> {
        const response = await axiosClient.post<IServerResponse<T>>(`/${this.resource}`, data);
        return response.data.data;
    }

    async update(id: string | number, data: Partial<T>): Promise<T> {
        const response = await axiosClient.put<IServerResponse<T>>(`/${this.resource}/${id}`, data);
        return response.data.data;
    }

    async delete(id: string | number): Promise<void> {
        await axiosClient.delete(`/${this.resource}/${id}`);
    }

}


