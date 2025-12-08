import React, { useState, useEffect } from 'react';
import './ImageUpload.css';

interface ImageUploadProps {
    label?: string;
    onChange: (file: File | null) => void;
    initialPreview?: string; // URL ảnh cũ nếu đang sửa
    error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, onChange, initialPreview, error }) => {
    const [preview, setPreview] = useState<string | null>(initialPreview || null);

    // Reset preview khi initialPreview thay đổi (lúc mở modal sửa)
    useEffect(() => {
        setPreview(initialPreview || null);
    }, [initialPreview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Tạo URL preview nội bộ
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onChange(file); // Trả file về form cha
        }
    };

    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}

            <div className="image-upload-container">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="image-upload-input"
                />

                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="image-upload-preview"
                    />
                ) : (
                    <div className="image-upload-placeholder">
                        <span className="image-upload-placeholder-icon">📷</span>
                        <p>Kéo thả ảnh vào đây hoặc click để chọn</p>
                    </div>
                )}
            </div>
            {error && <span className="form-error-message" style={{ color: 'red', fontSize: '0.85rem' }}>{error}</span>}
        </div>
    );
};
