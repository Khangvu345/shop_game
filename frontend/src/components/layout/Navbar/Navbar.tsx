import React from 'react';
import './Navbar.css';

interface NavbarProps {
    logo?: React.ReactNode;
    links: React.ReactNode;
    search?: React.ReactNode; // Thêm prop search
    actions?: React.ReactNode;
    styleNav?: '-horizontal' | '-vertical';
}

export function Navbar({ logo, links, search, actions, styleNav = "-horizontal" }: NavbarProps) {
    return (
        <div className={"navbar" + styleNav}>
            <div className={"navbar-logo" + styleNav}>
                {logo}
            </div>

            {links && (
                <nav className={"navbar-nav"+ styleNav}>
                    {links}
                </nav>
            )}

            {/* Thêm khu vực hiển thị Search */}
            {search && (
                <div className={"navbar-search" + styleNav}>
                    {search}
                </div>
            )}

            <div className={"navbar-actions"+ styleNav}>
                {actions}
            </div>
        </div>
    );
}