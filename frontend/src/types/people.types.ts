import type { TAccountProvider, TAccountStatus } from './common.types';

export interface IParty {
    party_id: string;
    full_name: string;
    email?: string;
    phone?: string;
    birth_date?: string;
    note?: string;
    created_at: string;
    updated_at: string;
}

export interface ICustomer extends IParty {
    tier?: string;
    points: number;
}

export interface IEmployee extends IParty {
    employee_code: string;
    hire_date?: string;
    status?: string;


    roles?: IRole[];
}

export interface IRole {
    role_id: string;
    role_name: string;
}

export interface IAddress {
    address_id: string;
    party_id: string;
    line1: string;
    line2?: string;
    ward?: string;
    district?: string;
    city: string;
    postal_code?: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface IAccount {
    account_id: string;
    party_id: string;
    provider: TAccountProvider;
    provider_user_id?: string;
    username?: string;
    email_for_login?: string;
    account_status: TAccountStatus;
    created_at: string;
    last_login_at?: string;
}