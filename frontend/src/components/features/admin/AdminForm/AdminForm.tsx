import React, { useEffect, useState } from 'react';
import { Button} from "../../../ui/button/Button.tsx";
import { Input} from "../../../ui/input/Input.tsx";

import './AdminForm.css'

interface AdminFormProps<T> {
    template: T; // Object mẫu để biết có những trường nào
    initialData?: T; // Dữ liệu sửa (nếu có)
    onSubmit: (data: T) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const AdminForm = <T extends Record<string, unknown>>({
                                                                 template,
                                                                 initialData,
                                                                 onSubmit,
                                                                 onCancel,
                                                                 isSubmitting
                                                             }: AdminFormProps<T>) => {

    // Khởi tạo form dựa trên template (nếu thêm mới) hoặc initialData (nếu sửa)
    const [formData, setFormData] = useState<T>(initialData || template);

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData(template);
    }, [initialData, template]);

    const handleChange = (key: keyof T, value: unknown) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Lấy danh sách các trường từ Template
    const fields = Object.keys(template);

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((key) => {
                    // Logic đoán loại Input
                    const value = formData[key];
                    const isIdField = key.toLowerCase().includes('id') && key.toLowerCase().endsWith('id'); // Ví dụ: productId, ID...
                    const isDateField = key.toLowerCase().includes('date') || key.toLowerCase().includes('at');
                    const isNumber = typeof template[key] === 'number';

                    // Không cho sửa ID chính (Primary Key)
                    // (Logic đoán ID: chứa chữ Id và đang ở chế độ Sửa)
                    const isReadOnly = isIdField && !!initialData;

                    return (
                        <div key={key} className="col-span-1">
                            <Input
                                label={key.charAt(0).toUpperCase() + key.slice(1)} // Viết hoa chữ cái đầu
                                type={isNumber ? 'number' : (isDateField ? 'datetime-local' : 'text')}
                                value={value !== null && value !== undefined ? String(value) : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    handleChange(key as keyof T, isNumber ? Number(val) : val);
                                }}
                                disabled={isReadOnly} // Khóa ID khi sửa
                                readOnly={isReadOnly}
                                className={isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button type="button" onClick={onCancel} disabled={isSubmitting}>Hủy</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {initialData ? 'Lưu thay đổi' : 'Tạo mới'}
                </Button>
            </div>
        </form>
    );
};