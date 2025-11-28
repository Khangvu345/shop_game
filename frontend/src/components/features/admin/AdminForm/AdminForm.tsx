// src/components/ui/AdminGenericForm.tsx
import React, { useEffect, useState } from 'react';
import { Button} from "../../../ui/button/Button";
import { Input} from "../../../ui/input/Input";
import { Select} from "../../../ui/input/Select";
import type {IFieldConfig} from "../../../../types";

interface AdminFormProps<T> {
    fields: IFieldConfig<T>[];
    initialData?: Partial<T>;
    onSubmit: (data: T) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const AdminForm = <T extends Record<string, any>>({
                                                                    fields, initialData, onSubmit, onCancel, isSubmitting
                                                                }: AdminFormProps<T>) => {

    const [formData, setFormData] = useState<Partial<T>>({});

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({});
    }, [initialData]);

    const handleChange = (name: keyof T, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as T);
    };

    const renderField = (field: IFieldConfig<T>) => {
        const value = formData[field.name] ?? ''; // Tránh lỗi controlled component

        if (field.type === 'select') {
            return (
                <Select
                    label={field.label}
                    value={value}
                    options={field.options || []}
                    onChange={(e) => handleChange(field.name, e.target.value)} // Select value luôn là string/number
                    required={field.required}
                    disabled={field.disabled}
                />
            );
        }

        if (field.type === 'textarea') {
            return (
                <div className="form-group">
                    <label className="form-label">{field.label}</label>
                    <textarea
                        className="form-input"
                        rows={4}
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        disabled={field.disabled}
                        style={{ width: '100%', resize: 'vertical' }}
                    />
                </div>
            );
        }

        // Mặc định là Input (text, number...)
        return (
            <Input
                label={field.label}
                type={field.type}
                value={value}
                onChange={(e) => {
                    // Nếu là number thì ép kiểu ngay lập tức
                    const val = field.type === 'number' ? Number(e.target.value) : e.target.value;
                    handleChange(field.name, val);
                }}
                required={field.required}
                disabled={field.disabled}
            />
        );
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
            {/* Grid Layout 2 cột */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {fields.map((field) => (
                    <div key={String(field.name)} style={{ gridColumn: field.colSpan === 2 ? 'span 2' : 'span 1' }}>
                        {renderField(field)}
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <Button type="button" onClick={onCancel} disabled={isSubmitting}>Hủy</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {initialData ? 'Lưu thay đổi' : 'Tạo mới'}
                </Button>
            </div>
        </form>
    );
};