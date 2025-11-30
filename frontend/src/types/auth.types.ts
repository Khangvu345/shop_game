export interface IUser {
    id: number;
    email: string;
    fullName: string;
    role: 'admin' | 'employee' | 'user';
}

export interface IAuthResponse {
    user: IUser;
    token: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface IRegisterPayload {
    email: string;
    password: string;
    fullName: string;
}