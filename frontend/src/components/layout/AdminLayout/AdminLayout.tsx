import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

import './AdminLayout.css'
import { Navbar } from "../Navbar/Navbar.tsx";
import { Button } from "../../ui/button/Button.tsx";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { logoutUser } from "../../../store/slices/Auth/authSlice.ts";

function AdminNavLinks() {




    return (
        <>
            <NavLink to="dashboard" className="admin-nav-link">Bảng điều khiển</NavLink>
            <NavLink to="users" className="admin-nav-link">Quản lí người dùng</NavLink>
            <NavLink to="products" className="admin-nav-link">Quản lí sản phẩm</NavLink>
            <NavLink to="categories" className="admin-nav-link">Quản lí danh mục</NavLink>
            <NavLink to="suppliers" className="admin-nav-link">Quản lí nhà cung cấp</NavLink>
            <NavLink to="orders" className="admin-nav-link">Quản lí đơn hàng</NavLink>
            <NavLink to="shipments" className="admin-nav-link">Quản vận chuyển</NavLink>
            <NavLink to="stock-movements" className="admin-nav-link" >Lịch sử biến động kho</NavLink>
            <NavLink to="goods-receipts" className="admin-nav-link">Nhập hàng</NavLink>

        </>
    )
}

function AdminActionBar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = async () => {
        if (user?.accountId) {
            await dispatch(logoutUser(user.accountId));
            navigate('/auth/login');
        }
    };
    return (
        <>
            <Button>Cài đặt</Button>
            <Button onClick={handleLogout}>Đăng xuất</Button>
        </>
    )
}

export function AdminLayout() {
    return (
        <div className={'admin-container'}>
            <header className={'admin-header'}>
                <h1>Quản li cơ sở dữ liệu</h1>
            </header>
            <aside className={'admin-sidebar'}>
                <Navbar styleNav={"-vertical"} links={<AdminNavLinks />} actions={<AdminActionBar />}></Navbar>
            </aside>
            <main className={'admin-main-content'}>
                <Outlet />
            </main>
        </div>
    );
}