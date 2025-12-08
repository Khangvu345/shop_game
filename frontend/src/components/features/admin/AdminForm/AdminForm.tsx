// src/components/ui/AdminGenericForm.tsx
import React, { useEffect, useState } from 'react';
import { Button } from "../../../ui/button/Button";
import { Input } from "../../../ui/input/Input";
import { Select } from "../../../ui/input/Select";
import type { IFieldConfig } from "../../../../types";

import './AdminForm.css'
import { ImageUpload } from "../../../ui/input/ImageUpload.tsx";
import { SkuInput } from "../../../ui/input/SkuInput.tsx";

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
    const [skuValid, setSkuValid] = useState(true); // Track SKU validation status

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

        // Special handling for SKU field with validation
        if (field.name === 'sku') {
            return (
                <SkuInput
                    label={field.label}
                    value={value as string}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    disabled={field.disabled}
                    productId={initialData?.['productId' as keyof T] as number | undefined}
                    onValidationChange={(isValid) => setSkuValid(isValid)}
                />
            );
        }

        if (field.type === 'select') {
            return (
                <Select
                    label={field.label}
                    value={value}
                    options={field.options || []}
                    onChange={(e) => {
                        let val: any = e.target.value;
                        // Convert to number for categoryId field
                        if (field.name === 'categoryId') {
                            val = Number(val);
                        }
                        handleChange(field.name, val);
                    }}
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

        if (field.type === 'image') {
            // Chỉ truyền initialPreview nếu value là string URL
            // Nếu value là File, component ImageUpload sẽ tự tạo preview từ File object
            const imagePreview = typeof value === 'string' ? value : undefined;

            return (
                <ImageUpload
                    label={field.label}
                    initialPreview={imagePreview}
                    onChange={(file) => handleChange(field.name, file)}
                />
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
  <div className="admin-form-overlay" onClick={onCancel}>
    <div className="admin-form-container" onClick={(e) => e.stopPropagation()}>
      <div className="admin-form-header">
        <h2>{initialData ? 'Cập nhật thông tin' : 'Thêm mới'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-content">
        <div className="admin-form-column-container">
          {fields.map((field) => (
            <div
              key={String(field.name)}
              className="form-group"
              style={{ gridColumn: field.colSpan === 2 ? 'span 2' : 'auto' }}
            >
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Không cần button ẩn nữa */}
      </form>

      <div className="admin-form-actions">
        <Button type="button" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          type="button"
          onClick={() => {
            const form = document.querySelector('.admin-form-content') as HTMLFormElement;
            form?.requestSubmit();
          }}
          disabled={isSubmitting || !skuValid}
        >
          {initialData ? 'Lưu thay đổi' : 'Tạo mới'}
        </Button>
      </div>
    </div>
  </div>
);
};