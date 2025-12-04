import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({label, className = '', error, ...props}: InputProps){
    return (
        <div className={`w-full ${className}`}>
            <div className="input-content-wrapper">

            {label && (
                <label className="">
                    {label}
                </label>
            )}
                <input
                    className={`${error ? 'border-red' : 'border-gray'} ${className}`}
                    {...props}

                />
            
            {error && <p>{error}</p>}
            </div>
        </div>
    );

}