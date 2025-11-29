import React from "react";
import { Button} from "../../../ui/button/Button.tsx";
import {Spinner} from "../../../ui/loading/Spinner.tsx";

import './AdminTable.css';
import type {IColumn} from "../../../../types";

interface AdminTableProps<T> {
    columns: IColumn<T>[];
    data: T[];
    isLoading?: boolean;


    rowKey: (item: T) => string | number;

    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export function AdminTable<T extends object>({
                                                 columns,
                                                 data,
                                                 isLoading,
                                                 rowKey,
                                                 onEdit,
                                                 onDelete
                                             }: AdminTableProps<T>){

    if (isLoading) return <Spinner></Spinner>;
    if (!data || data.length === 0) return <div>Chưa có dữ liệu</div>;

    return (
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>

                {/* --- HEADER --- */}
                <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                    {columns.map((col, index) => (
                        <th
                            key={String(col.key) + index}
                            style={{
                                padding: '12px 16px',
                                textAlign: 'left',
                                fontWeight: 600,
                                color: '#495057',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {col.title.toUpperCase()}
                        </th>
                    ))}

                    {/* Cột thao tác (chỉ hiện nếu có truyền onEdit hoặc onDelete) */}
                    {(onEdit || onDelete) && (
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#495057', width: '120px' }}>
                            THAO TÁC
                        </th>
                    )}
                </tr>
                </thead>

                {/* --- BODY --- */}
                <tbody>
                {data.map((item) => (
                    <tr
                        key={rowKey(item)}
                        style={{ borderBottom: '1px solid #e9ecef' }}
                        // Hiệu ứng hover (nếu bạn có class hover trong CSS)
                        className="table-row-hover"
                    >
                        {/* Lặp qua các cột để vẽ dữ liệu */}
                        {columns.map((col, colIndex) => (
                            <td key={colIndex} style={{ padding: '12px 16px', verticalAlign: 'middle', color: '#333' }}>
                                {col.render
                                    ? col.render(item) // Nếu có hàm render riêng -> dùng nó
                                    : (item[col.key] as React.ReactNode) // Nếu không -> hiển thị giá trị thô
                                }
                            </td>
                        ))}

                        {/* Vẽ các nút thao tác */}
                        {(onEdit || onDelete) && (
                            <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                {onEdit && (
                                    <Button
                                        style={{ marginRight: '0.5rem', padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                                        onClick={() => onEdit(item)}
                                    >
                                        Sửa
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                                        onClick={() => onDelete(item)}
                                    >
                                        Xóa
                                    </Button>
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
