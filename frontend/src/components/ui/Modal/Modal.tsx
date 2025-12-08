import React, { useEffect } from 'react';
import { Button } from '../button/Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }:ModalProps){
    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '1rem', flexDirection: 'column'
        }}>
            {/* Content Container - Thêm style nền trắng tại đây */}
            <div style={{
                backgroundColor: 'white',        // Nền trắng
                borderRadius: '12px',            // Bo góc
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', // Đổ bóng
                padding: '20px',                 // Khoảng cách lề trong
                maxWidth: '600px',               // Chiều rộng tối đa
                width: '100%',                   // Co giãn theo màn hình
                position: 'relative'
            }}>
                {/* Header Modal */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1.5rem',      // Tăng khoảng cách dưới header
                    borderBottom: '1px solid #f1f5f9', 
                    paddingBottom: '1rem' 
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>{title}</h3>
                    <Button onClick={onClose} style={{ padding: '0.2rem 0.6rem', minWidth: 'auto' }}>✕</Button>
                </div>

                {children}
            </div>
        </div>
    );
}