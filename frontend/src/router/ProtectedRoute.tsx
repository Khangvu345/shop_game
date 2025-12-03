import React from 'react';
import {Link, Navigate, Outlet, useLocation} from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export function LoggedInRoute(){
    const { user } = useAppSelector((state) => state.auth);

    const location = useLocation();

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    return <Outlet />;
}

export function AuthRoute(){
    const { user } = useAppSelector((state) => state.auth);

    const location = useLocation();

    if (user) {
        if (user.role == "ADMIN") {
            <Navigate to="admin" state={{ from: location }} replace />;
        }
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <Outlet />;
}

export function AdminRoute(){
    const { user } = useAppSelector((state) => state.auth);

    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (user.role != 'ADMIN'){
        return <>
            <h1>Không thể truy cập trang này</h1>
            <Link to={'/'}>Quay lại trang chủ</Link>
        </>
    }
    return <Outlet />;
}