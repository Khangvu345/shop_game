// src/components/layout/MainLayout/MainLayout.tsx
import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Logo } from "../../ui/logo/Logo.tsx";
import { logoutUser } from "../../../store/slices/Auth/authSlice.ts";
import Footer from '../Footer/Footer.tsx';
// Import các Icon mới
import {
    CartIcon,
    UserIcon,
    PhoneIcon,
    LogOutIcon,
    LoginIcon
} from '../../ui/icon/icon.tsx';
import './MainLayout.css' // Đảm bảo CSS đã được update

// Component Search Bar
function SearchBar() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log("Searching for:", keyword);
            navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
        />
    );
}

function NavLogo() {
    return (
        <Link to="/" className="nav-logo">
            <Logo size={'medium'} style={{ height: '50px', width: 'auto' }}></Logo>
        </Link>
    )
}

function PublicNavLinks() {
    return (
        <>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Trang chủ
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Sản phẩm
            </NavLink>
            {/* Thay chữ Liên hệ bằng Icon Phone như yêu cầu */}
            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-icon-link active" : "nav-icon-link"} title="Liên hệ">
                <PhoneIcon width={20} height={20} />
            </NavLink>
        </>
    )
}

function ActionBar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const cartItems = useAppSelector((state: any) => state.cart.items);
    const cartCount = cartItems ? cartItems.length : 0;

    const handleLogout = async () => {
        if (user?.accountId) {
            await dispatch(logoutUser(user.accountId));
            navigate('/auth/login');
        }
    };

    return (
        <>
            {/* 1. Cart Icon - Luôn hiển thị */}
            <Link to={'/cart'} className="action-icon-btn" title="Giỏ hàng">
                <CartIcon />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* 2. Logic hiển thị User/Login */}
            {user ? (
                <>
                    {/* Đã đăng nhập: Hiện Icon User (vào Profile) và Icon Logout */}
                    <Link to={'/profile'} className="action-icon-btn" title="Tài khoản cá nhân">
                        <UserIcon />
                    </Link>

                    <button onClick={handleLogout} className="action-icon-btn" title="Đăng xuất">
                        <LogOutIcon />
                    </button>
                </>
            ) : (
                <>
                    {/* Chưa đăng nhập: Hiện Icon Login */}
                    <Link to={'/auth/login'} className="action-icon-btn" title="Đăng nhập / Đăng ký">
                        <LoginIcon />
                    </Link>
                </>
            )}
        </>
    )
}

export function MainLayout() {
    return (
        <div className="main-container">
            <header className="main-header">
                <Navbar
                    logo={<NavLogo />}
                    links={<PublicNavLinks />}
                    search={<SearchBar />}
                    actions={<ActionBar />}
                />
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className={'main-footer'}>
                <Footer />
            </footer>
        </div>
    );
}