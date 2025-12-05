export interface IAuthUser {
    accountId: number;
    username: string;
    partyId: number;
    fullName: string;
    role: 'ADMIN' | 'USER' ;
}

export interface ILoginResponse extends IAuthUser {
    token: string;
}

export interface ILoginPayload {
    username?: string;
    email?: string;
    password: string;
}

export interface IRegisterPayload {
    fullName: string;
    username: string;
    password: string;
    email: string;
    phone?: string;
}