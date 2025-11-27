import React from 'react';

// Định nghĩa kiểu dữ liệu cho một lựa chọn (Option)
export interface SelectOption {
    label: string;
    value: string | number;
}

// Kế thừa các thuộc tính chuẩn của thẻ <select> HTML
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;          // Nhãn (Label)
    options: SelectOption[]; // Danh sách các lựa chọn
    error?: string;          // Thông báo lỗi (nếu có)
}

export const Select: React.FC<SelectProps> = ({
                                                  label,
                                                  options,
                                                  error,
                                                  className = '',
                                                  id,
                                                  ...props
                                              }) => {

    // Tạo ID ngẫu nhiên nếu không truyền vào (để label hoạt động)
    const selectId = id || props.name ;

    return (
        <div className="form-group">
            {/* Label */}
    {label && (
        <label htmlFor={selectId} className="form-label">
        {label} {props.required && <span style={{ color: 'var(--danger-color)' }}>*</span>}
    </label>
    )}

        {/* Thẻ Select */}
        <select
            id={selectId}
        className={`form-input ${error ? 'input-error' : ''} ${className}`}
        style={{
        backgroundColor: '#fff', // Đảm bảo nền trắng
            cursor: 'pointer',
            appearance: 'auto' // Giữ mũi tên mặc định của trình duyệt cho đơn giản
    }}
        {...props}
    >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
            {opt.label}
            </option>
        ))}
        </select>

        {/* Thông báo lỗi */}
        {error && <span className="form-error-message">{error}</span>}
            </div>
        );
        };