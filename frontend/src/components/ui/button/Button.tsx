import React from 'react';


import './button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'small' | 'medium' | 'large';
    color?: '0' | '1' | '2';
    shape?: 'base';
}

export function Button({children, size = 'small',color = '0',shape = 'base' ,className = '', ...props }: ButtonProps) {
    const finalClassName = `btn btn-shape-${shape} btn-size-${size} btn-color-${color} ${className}`.trim();
    return (
        <button className={finalClassName} {...props}>
            {children}
        </button>
    );

}