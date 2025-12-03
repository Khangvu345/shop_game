import React, { useState, useEffect } from 'react';

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

            <div style={{
                border: '2px dashed var(--color-primary-3)',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: '#fff',
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                        opacity: 0,
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        cursor: 'pointer'
                    }}
                />

                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ maxHeight: '130px', borderRadius: '4px', objectFit: 'contain' }}
                    />
                ) : (
                    <div style={{ color: '#888' }}>
                        <span style={{fontSize: '2rem'}}>📷</span>
                        <p>Kéo thả ảnh vào đây hoặc click để chọn</p>
                    </div>
                )}
            </div>
            {error && <span className="form-error-message" style={{color: 'red', fontSize: '0.85rem'}}>{error}</span>}
        </div>
    );
};