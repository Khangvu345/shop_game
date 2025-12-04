import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Button } from "../../ui/button/Button";
import './MainLayout.css'
import { Logo } from "../../ui/logo/Logo.tsx";
import { logoutUser } from "../../../store/slices/Auth/authSlice.ts";
import Footer from '../Footer/Footer.tsx';
import React, { useState } from 'react'; // Import useState

// 1. Tạo component Icon Giỏ hàng (SVG)
const CartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

// 2. Component Search Bar
function SearchBar() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Chuyển hướng sang trang products kèm query params
            // Lưu ý: Cần update logic bên ProductListPage để đọc param này
            // Ví dụ: navigate(`/products?search=${keyword}`);
            console.log("Searching for:", keyword);
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
            <Logo size={'small'}></Logo>
        </Link>
    )
}

function PublicNavLinks() {
    return (
        <>
            <NavLink to="/" className="nav-link">Trang chủ</NavLink>
            <NavLink to="/products" className="nav-link">Sản phẩm</NavLink>
        </>
    )
}

function ActionBar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    // Lấy số lượng từ Redux (nếu có slice cart)
    const cartItems = useAppSelector((state: any) => state.cart.items);
    const cartCount = cartItems ? cartItems.length : 0;

    const handleLogout = async () => {
        if (user?.accountId) {
            await dispatch(logoutUser(user.accountId));
            navigate('/auth/login');
        }
    };

    // Nút giỏ hàng chung cho cả 2 trạng thái login/logout
    const CartButton = (
        <Link to={'/cart'} className="cart-icon-btn">
            <CartIcon />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
    );

    if (user) {
        return (
            <>
                {CartButton}
                <Button onClick={() => { navigate('/my-orders'); }}>
                    Profile
                </Button>
                <Button onClick={handleLogout}>Đăng xuất</Button>
            </>
        )
    } else {
        return (
            <>
                {CartButton}
                <Link to={'/auth/login'}>
                    <Button size="small" color="0">Đăng nhập</Button>
                </Link>
                <Link to={'/auth/register'}>
                    <Button size="small" color="0">Đăng ký</Button>
                </Link>
            </>
        )
    }
}

export function MainLayout() {
    return (
        <div className="main-container">
            <header className="main-header">
                <Navbar 
                    logo={<NavLogo />} 
                    links={<PublicNavLinks />} 
                    search={<SearchBar />}  // Truyền SearchBar vào đây
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