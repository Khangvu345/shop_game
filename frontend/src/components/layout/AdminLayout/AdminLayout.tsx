import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';

import './AdminLayout.css'
import {Navbar} from "../Navbar/Navbar.tsx";
import {Button} from "../../ui/button/Button.tsx";

function AdminNavLinks () {
    return (
        <>
            <NavLink to="/admin/dashboard" className="admin-nav-link">Bảng điều khiển</NavLink>
            <NavLink to="/admin/users" className="admin-nav-link">Quản lí người dùng</NavLink>
            <NavLink to="/admin/products" className="admin-nav-link">Quản lí sản phẩm</NavLink>
            <NavLink to="/admin/categories" className="admin-nav-link">Quản lí danh mục</NavLink>
            <NavLink to="/admin/orders" className="admin-nav-link">Quản lí đơn hàng</NavLink>
        </>
    )
}

function AdminActionBar (){
    return (
        <>
            <Button>Cài đặt</Button>
            <Button>Đăng xuất</Button>
        </>
    )
}

export function AdminLayout(){
    return (
        <div className={'admin-container'}>
            <header className={'admin-header'}>
                <h1>Quản li cơ sở dữ liệy</h1>
            </header>
            <aside className={'admin-sidebar'}>
                <Navbar styleNav={"-vertical"} links={<AdminNavLinks />} actions={<AdminActionBar/>}></Navbar>
            </aside>
            <main className={'admin-main-content'}>
                <Outlet />
            </main>
        </div>
    );
}