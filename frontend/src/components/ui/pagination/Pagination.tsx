// src/components/ui/Pagination.tsx
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
    if (totalPages <= 1) return null; // Không cần phân trang nếu chỉ có 1 trang

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Trước
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}

            <Button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Sau
            </Button>
        </div>
    );
};