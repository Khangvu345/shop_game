import React from 'react';
import './Navbar.css';

interface NavbarProps {
    logo?: React.ReactNode;
    links: React.ReactNode;
    actions?: React.ReactNode;
    styleNav?: '-horizontal' | '-vertical';
}


export function Navbar({ logo, links, actions, styleNav = "-horizontal" }: NavbarProps) {
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

            <div className={"navbar-actions"+ styleNav}>
                {actions}
            </div>

        </div>
    );
}