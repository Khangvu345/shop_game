import React, { useState, useEffect } from 'react';
import './TruckOrderButton.css';

interface TruckOrderButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isLoading?: boolean;
    className?: string;
    form?: string; // Để liên kết với form bên ngoài
}

export const TruckOrderButton: React.FC<TruckOrderButtonProps> = ({ 
    onClick, 
    isLoading, 
    className = '',
    form
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    // Khi isLoading = true (đang gọi API), bắt đầu animation
    useEffect(() => {
        if (isLoading) {
            setIsAnimating(true);
        } else {
            // Khi API xong, có thể giữ animation hoặc reset. 
            // Ở đây tôi giữ animation thêm 1 chút hoặc để nó chạy hết nếu muốn.
            // Nếu muốn reset ngay khi xong: setIsAnimating(false);
        }
    }, [isLoading]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isAnimating) {
            // setIsAnimating(true); // Logic này chuyển sang useEffect phụ thuộc vào isLoading
            if (onClick) {
                onClick(e);
            }
        }
    };

    return (
        <button 
            className={`order-truck-btn ${isAnimating ? 'animate' : ''} ${className}`} 
            onClick={handleClick}
            disabled={isAnimating} // Disable khi đang chạy animation
            type="submit" // Quan trọng để submit form
            form={form} // Liên kết với ID của form
        >
            <span className="default">ĐẶT HÀNG</span>
            <span className="success">
                Đặt hàng ngay hôm nay
                <svg viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg>
            </span>
            <div className="box"></div>
            <div className="truck">
                <div className="back"></div>
                <div className="front">
                    <div className="window"></div>
                </div>
                <div className="light top"></div>
                <div className="light bottom"></div>
            </div>
            <div className="lines"></div>
        </button>
    );
};
