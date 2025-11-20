import React from 'react';


interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {

    const finalClassName = `card ${className}`.trim();

    return (
        <div className={finalClassName} {...props}>
            {children}
        </div>
    );
};