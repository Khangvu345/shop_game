import React from 'react';
import './Navbar.css';

interface NavbarProps {
    logo?: React.ReactNode;
    links: React.ReactNode;
    actions?: React.ReactNode;
}


export function Navbar({ logo, links, actions }: NavbarProps) {
    return (
        <nav className="navbar">
            <div className="container navbar-container">

                <div className="navbar-logo-area">
                    {logo}
                </div>

                {links && (
                    <div className="navbar-nav">
                        {links}
                    </div>
                )}

                <div className="navbar-actions">
                    {actions}
                </div>

            </div>
        </nav>
    );
};