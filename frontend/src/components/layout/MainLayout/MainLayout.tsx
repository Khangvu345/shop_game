import { Outlet, Link, NavLink } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';

import { useAppSelector } from '../../../store/hooks';
import {Button} from "../../ui/button/Button";

import './MainLayout.css'
import {Logo} from "../../ui/logo/Logo.tsx";



function NavLogo() {
    return (
        <Link to="/" className="nav-logo">
            <Logo size={'small'}></Logo>
        </Link>
    )
}

function PublicNavLinks (){
    return (
        <>
            <NavLink to="/" className="nav-link">Trang chủ</NavLink>
            <NavLink to="/products" className="nav-link">Sản phẩm</NavLink>
        </>
        )

}

function ActionBar (){
    const dang_nhap = false
    if (dang_nhap){
        return (
            <>
                <Button>Profile</Button>
            </>
        )
    } else {
        return (
            <>
                <Link to={'/cart'}>
                    giỏ hàng
                </Link>
                <Button color={'1'}>Đăng nhập</Button>
                <Button>Đăng ký</Button>
            </>
        )
    }
}





export function MainLayout() {
    return (
        <div className="main-container">
            <header className="main-header">
                <Navbar logo={<NavLogo />} links={<PublicNavLinks />} actions={<ActionBar /> }/>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className={'main-footer'}></footer>

        </div>
    );
};