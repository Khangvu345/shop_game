// src/components/ui/AdminGenericForm.tsx
import React, { useEffect, useState } from 'react';
import { Input } from "../../../ui/input/Input";
import { Select } from "../../../ui/input/Select";
import type { IFieldConfig } from "../../../../types";

import './AdminForm.css'
import { ImageUpload } from "../../../ui/input/ImageUpload.tsx";
import { SkuInput } from "../../input/SkuInput.tsx";

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
      // For select fields, ensure empty string for null/undefined to properly show placeholder option
      const selectValue = value === null || value === undefined ? '' : value;

      return (
        <Select
          label={field.label}
          value={selectValue}
          options={field.options || []}
          onChange={(e) => {
            let val: any = e.target.value;
            // Convert to number for ID fields, or null if empty string
            if (field.name === 'categoryId' || field.name === 'parentId') {
              val = val === '' ? null : Number(val);
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
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: '#f5f5f5',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.borderColor = '#06b6d4';
                e.currentTarget.style.color = '#06b6d4';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.color = 'inherit';
            }}
          >
            HỦY
          </button>
          <button
            type="button"
            onClick={() => {
              const form = document.querySelector('.admin-form-content') as HTMLFormElement;
              form?.requestSubmit();
            }}
            disabled={isSubmitting || !skuValid}
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              border: 'none',
              background: '#06b6d4',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (isSubmitting || !skuValid) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: (isSubmitting || !skuValid) ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && skuValid) {
                e.currentTarget.style.background = '#0891b2';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#06b6d4';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {initialData ? 'LƯU THAY ĐỔI' : 'TẠO MỚI'}
          </button>
        </div>
      </div>
    </div>
  );
};