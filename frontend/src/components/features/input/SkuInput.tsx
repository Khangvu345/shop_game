import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../../ui/input/Input.tsx';
import { productApi } from '../../../api/ProductBlock/productApi.ts';

interface SkuInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    productId?: number; // ID sản phẩm đang edit (để exclude khỏi check)
    onValidationChange?: (isValid: boolean) => void; // Callback để thông báo validation status
}

export const SkuInput: React.FC<SkuInputProps> = ({
    label,
    value,
    onChange,
    required,
    disabled,
    productId,
    onValidationChange
}) => {
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Use ref to avoid re-render loop with onValidationChange
    const onValidationChangeRef = useRef(onValidationChange);

    useEffect(() => {
        onValidationChangeRef.current = onValidationChange;
    }, [onValidationChange]);

    useEffect(() => {
        // Reset nếu SKU rỗng
        if (!value || value.trim() === '') {
            setError(null);
            setSuccess(null);
            if (onValidationChangeRef.current) onValidationChangeRef.current(true); // Empty is valid
            return;
        }

        // Debounce: Chờ 500ms sau khi user ngừng gõ
        const timer = setTimeout(async () => {
            setChecking(true);
            setError(null);
            setSuccess(null);

            try {
                const result = await productApi.checkSku(value, productId);

                if (result.exists) {
                    setError('⚠️ SKU đã tồn tại, vui lòng chọn SKU khác');
                    if (onValidationChangeRef.current) onValidationChangeRef.current(false); // Invalid
                } else {
                    setSuccess('✓ SKU khả dụng');
                    if (onValidationChangeRef.current) onValidationChangeRef.current(true); // Valid
                }
            } catch (err: any) {
                // Nếu lỗi 403 (Forbidden) hoặc 401 (Unauthorized)
                if (err.response?.status === 403 || err.response?.status === 401) {
                    setError('⚠️ Không có quyền kiểm tra SKU');
                } else {
                    setError('⚠️ Không thể kiểm tra SKU');
                }
                if (onValidationChangeRef.current) onValidationChangeRef.current(false); // Invalid on error
            } finally {
                setChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [value, productId]); // ✅ Removed onValidationChange from dependencies

    return (
        <div className="form-group">
            <Input
                label={label}
                type="text"
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            />
            <div style={{ marginTop: '0.25rem', minHeight: '20px' }}>
                {checking && <span style={{ color: '#888', fontSize: '0.85rem' }}>⏳ Đang kiểm tra...</span>}
                {error && <span style={{ color: 'red', fontSize: '0.85rem', fontWeight: 500 }}>{error}</span>}
                {success && <span style={{ color: 'green', fontSize: '0.85rem', fontWeight: 500 }}>{success}</span>}
            </div>
        </div>
    );
};
