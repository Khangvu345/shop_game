import React from 'react';
import { Button } from '../button/Button';

interface PaginationProps {
    totalRows: number;
    limit: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          totalRows, limit, currentPage, onPageChange
                                                      }) => {
    const totalPages = Math.ceil(totalRows / limit);

    // Nếu chỉ có 1 trang hoặc không có dữ liệu -> Ẩn phân trang
    if (totalPages <= 1) return null;

    // --- HÀM TÍNH TOÁN CÁC TRANG CẦN HIỂN THỊ ---
    const getPageNumbers = () => {
        const pages = [];
        const delta = 1; // Số trang hiển thị bên cạnh trang hiện tại (ví dụ: [9] 10 [11])

        // Trường hợp 1: Ít trang (<= 7) -> Hiển thị hết
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Trường hợp 2: Nhiều trang (> 7) -> Cần dùng dấu "..."
        const rangeLeft = currentPage - delta;
        const rangeRight = currentPage + delta;

        // Luôn hiển thị trang 1
        pages.push(1);

        // Xử lý dấu "..." bên trái
        if (rangeLeft > 2) {
            pages.push('...'); // Dấu ba chấm trái
        } else if (rangeLeft === 2) {
            pages.push(2); // Nếu sát quá thì hiện luôn số 2 thay vì "..."
        }

        // Hiển thị dải ở giữa (xung quanh currentPage)
        for (let i = Math.max(2, rangeLeft); i <= Math.min(totalPages - 1, rangeRight); i++) {
            // Tránh trùng lặp với trang 1 hoặc trang cuối (đã xử lý riêng)
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }

        // Xử lý dấu "..." bên phải
        if (rangeRight < totalPages - 1) {
            pages.push('...'); // Dấu ba chấm phải
        } else if (rangeRight === totalPages - 1) {
            pages.push(totalPages - 1);
        }

        // Luôn hiển thị trang cuối
        pages.push(totalPages);

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
            {/* Nút Trước */}
            <Button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Trước
            </Button>

            {/* Render danh sách trang */}
            {pages.map((page, index) => {
                // Nếu là dấu "..."
                if (page === '...') {
                    return (
                        <span key={`dots-${index}`} style={{ padding: '0.5rem', alignSelf: 'center', color: '#666' }}>
              ...
            </span>
                    );
                }

                // Nếu là số trang
                return (
                    <Button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        style={{ minWidth: '40px' }} // Đảm bảo nút vuông vắn
                    >
                        {page}
                    </Button>
                );
            })}

            {/* Nút Sau */}
            <Button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Sau
            </Button>
        </div>
    );
};