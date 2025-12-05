import React from "react";
import { Button } from "../../../ui/button/Button.tsx";
import { Spinner } from "../../../ui/loading/Spinner.tsx";

import './AdminTable.css';
import type { IColumn } from "../../../../types";

interface AdminTableProps<T> {
    columns: IColumn<T>[];
    data: T[];
    isLoading?: boolean;


    rowKey: (item: T) => string | number;

    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    editButtonText?: string;  // Tùy chỉnh text nút edit (mặc định: "Sửa")
}

export function AdminTable<T extends object>({
    columns,
    data,
    isLoading,
    rowKey,
    onEdit,
    onDelete,
    editButtonText = "Sửa"  // Giá trị mặc định
}: AdminTableProps<T>) {

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <Spinner />
            </div>
        );
    }
    if (!data || data.length === 0) return <div>Chưa có dữ liệu</div>;

    return (
        <div className="admin-table-wrapper">
            <table className="admin-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={String(col.key) + index}>
                                {col.title.toUpperCase()}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th style={{ textAlign: 'right', width: '120px' }}>
                                THAO TÁC
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={rowKey(item)}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {col.render
                                        ? col.render(item)
                                        : (item[col.key] as React.ReactNode)
                                    }
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="admin-table-actions">
                                    {onEdit && (
                                        <button
                                            className="admin-table-btn-edit"
                                            onClick={() => onEdit(item)}
                                        >
                                            {editButtonText}
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            className="admin-table-btn-delete"
                                            onClick={() => onDelete(item)}
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
