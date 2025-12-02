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

export interface IEmployee extends IParty {
    employeeCode: string;
    hireDate?: string;
    status?: string;

    roles?: IRole[];
}

export interface IRole {
    roleId: number;
    roleName: string;
}

export interface IAddress {
    addressId: number;
    partyId: number;
    line1: string;
    line2?: string;
    ward?: string;
    district?: string;
    city: string;
    postalCode?: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IAccount {
    accountId: number;
    partyId: number;
    provider: TAccountProvider;
    providerUserId?: string;
    username?: string;
    emailForLogin?: string;
    accountStatus: TAccountStatus;
    createdAt: string;
    lastLoginAt?: string;
}