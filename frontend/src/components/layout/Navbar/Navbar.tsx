import React from 'react';
import './Navbar.css';

interface NavbarProps {
    logo?: React.ReactNode;
    links: React.ReactNode;
    search?: React.ReactNode;
    actions?: React.ReactNode;
}


export function Navbar({ logo, links, actions }: NavbarProps) {
    return (
        <div className="navbar">
            <div className="navbar-logo">
                {logo}
            </div>

            {links && (
                <nav className="navbar-nav">
                    {links}
                </nav>
            )}

            <div className="navbar-actions">
                {actions}
            </div>

        </div>
    );
}