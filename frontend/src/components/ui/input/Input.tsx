import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({
                          label,
                          id,
                          className = '',
                          error,
                          ...props
                      }: InputProps) => {

    const inputId = id || props.name ;

    return (
        <div className="input-container">
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label} {props.required && <span style={{ color: 'var(--danger-color)' }}>*</span>}
                </label>
            )}

            <input
                id={inputId}
                className={`form-input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />

            {error && <span className="form-error-message">{error}</span>}
        </div>
    );
};