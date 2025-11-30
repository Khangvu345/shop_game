import {Outlet, Link, NavLink, useNavigate} from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';

import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {Button} from "../../ui/button/Button";

import './MainLayout.css'
import {Logo} from "../../ui/logo/Logo.tsx";
import {logoutUser} from "../../../store/slices/Auth/authSlice.ts";




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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = async () => {
        if (user?.accountId) {
            await dispatch(logoutUser(user.accountId));
            navigate('/login');
        }
    };
    if (user){
        return (
            <>
                <Button>Profile</Button>
                <Button onClick={handleLogout}>Đăng xuất</Button>

            </>
        )
    } else {
        return (
            <>
                <Link to={'/cart'}>
                    giỏ hàng
                </Link>
                <Link to={'/login'}>
                    <Button size = "small" color = "0" >Đăng nhập</Button>
                </Link>
                <Link to={'/regíter'}>
                    <Button size = "small" color = "0">Đăng ký</Button>
                </Link>
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
}