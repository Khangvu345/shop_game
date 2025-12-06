import React from 'react';
import { Button } from '../button/Button';
//import './pagination.css';

interface PaginationProps {
    currentPage: number;
    totalRows: number;
    limit: number; // Số item mỗi trang
    onPageChange: (page: number) => void;
    siblingCount?: number; // Số trang hiển thị bên cạnh trang hiện tại (mặc định 1)
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalRows,
                                                          limit,
                                                          onPageChange,
                                                          siblingCount = 1
                                                      }) => {
    // Tính tổng số trang
    const totalPages = Math.ceil(totalRows / limit);

    // Nếu chỉ có 1 trang hoặc không có dữ liệu thì không hiện phân trang
    if (totalPages <= 1) return null;

    // --- LOGIC TẠO DÃY SỐ TRANG ---
    const generatePagination = () => {

        const totalPageNumbers = siblingCount + 5;

        // Case 1: Nếu tổng số trang ít hơn số nút tối đa -> Hiện tất cả
        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        // Quy định khi nào hiện dấu "..."
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        // Case 2: Chỉ hiện "..." bên phải (Đang ở gần đầu)
        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount; // Hiện nhiều hơn một chút ở đầu
            const leftRange = range(1, leftItemCount);
            return [...leftRange, '...', totalPages];
        }

        // Case 3: Chỉ hiện "..." bên trái (Đang ở gần cuối)
        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [firstPageIndex, '...', ...rightRange];
        }

        // Case 4: Hiện "..." cả 2 bên (Đang ở giữa)
        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
    };

    // Hàm tạo mảng số (Helper)
    const range = (start: number, end: number) => {
        const length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    };

    const paginationRange = generatePagination();

    return (
        <div className="pagination-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Nút Previous */}
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                color="0"
                size="small"
            >
                &lt;
            </Button>

            {/* Danh sách trang */}
            {paginationRange?.map((pageNumber, index) => {
                // Render dấu "..."
                if (pageNumber === '...') {
                    return <span key={index} className="pagination-dots">...</span>;
                }

                // Render số trang
                return (
                    <Button
                        key={index}
                        onClick={() => onPageChange(pageNumber as number)}
                        // Highlight trang hiện tại (Dùng màu '1' hoặc style riêng)
                        color={pageNumber === currentPage ? '1' : '0'}
                        size="small"
                        style={{ minWidth: '32px' }} // Đảm bảo nút vuông vắn
                    >
                        {pageNumber}
                    </Button>
                );
            })}

            {/* Nút Next */}
            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                color="0"
                size="small"
            >
                &gt;
            </Button>
        </div>
    );
};