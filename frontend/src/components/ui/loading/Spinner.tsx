import React from 'react';
import './spinner.css'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'spinner1' | 'spinner2';
}

export function Spinner({ type = "spinner1", className = "", ...props }: SpinnerProps) {
    const finalClassName = `${type} ${className}`.trim();
    return <div className={finalClassName} {...props}></div>;
}