import type { TAccountProvider, TAccountStatus } from './common.types';

export interface IParty {
    partyId: number;
    fullName: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICustomer extends IParty {
    tier?: string;
    points: number;
}


export interface ICustomerProfile {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    birthDate: string; // YYYY-MM-DD
    tier: string;
    points: number;
    totalOrders: number;
    totalSpent: number;
}

export interface ICustomerListItem {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    tier: string;
    points: number;
    totalOrders: number;
    totalSpent: number;
    registeredDate: string;
}

export interface IAddressResponse {
    id: number;
    line1: string;
    line2?: string;
    ward: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
}

// --- Request DTOs ---

export interface IUpdateProfilePayload {
    fullName: string;
    phone: string;
    birthDate: string;
}

export interface IChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ISaveAddressPayload {
    line1: string;
    line2?: string;
    ward: string;
    city: string;
    postalCode?: string;
}

export interface IAdminCustomerFilter {
    page: number;
    size: number;
    keyword?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
}