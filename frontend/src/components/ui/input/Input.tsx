import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({label, className = '', error, ...props}: InputProps){
    return (
        <div className={`w-full ${className}`}>
            <div className="input-content-wrapper">
            <input
                className={`${error ? 'border-red' : 'border-gray'} ${className}`}
                {...props}
                
            />
            {label && (
                <label className="">
                    {label}
                </label>
            )}
            
            {error && <p>{error}</p>}
            </div>
        </div>
    );

}