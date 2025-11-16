import { Outlet, Link, NavLink } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { useAppSelector } from '../../../store/hooks';
import {Button} from "../../ui/button/Button";

import './MainLayout.css'



const PublicNavLinks = () => (
    <>
        <NavLink to="/" className="nav-link">Trang chủ</NavLink>
        <NavLink to="/products" className="nav-link">Sản phẩm</NavLink>
        {/* Thêm link "Thiết bị", "Phụ kiện" sau... */}
    </>
);

const LoginButton = () => (
    <>
        <Button>Login</Button>
    </>
)



export const MainLayout: React.FC = () => {
    return (
        <div className="app-container">
            <Navbar links={<PublicNavLinks />} actions={<LoginButton /> }/>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};