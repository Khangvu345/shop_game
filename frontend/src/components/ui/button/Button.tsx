import React from 'react';


import './button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'small' | 'medium' | 'large';
    shape?: 'base';
}

export function Button({children, size = 'small',shape = 'base' ,className = '', ...props }: ButtonProps) {
    const finalClassName = `btn btn-shape-${shape} btn-size-${size} ${className}`.trim();
    return (
        <button className={finalClassName} {...props}>
            {children}
        </button>
    );

}