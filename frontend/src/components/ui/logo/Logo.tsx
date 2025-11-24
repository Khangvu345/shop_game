import React from 'react';
import './Logo.css'


interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'small' | 'medium' | 'large';
}


export function Logo({ size = 'medium', className = '', ...props }: LogoProps) {
    const finalClassName = `logo logo-size-${size} ${className}`.trim();
    return (
        <img src={"./assets/images/logo.png"} className={finalClassName} {...props} alt="Logo" />
    );
}