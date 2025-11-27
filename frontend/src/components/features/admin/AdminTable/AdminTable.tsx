import React from 'react';
import { Button} from "../../../ui/button/Button.tsx";

import './AdminTable.css';

interface AdminTableProps<T> {
    data: T[];
    isLoading?: boolean;
    rowKey?: keyof T; // Cho phép chỉ định trường ID
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export const AdminTable = <T extends Record<string, never>>({
                                                                  data, isLoading, rowKey, onEdit, onDelete
                                                              }: AdminTableProps<T>) => {

    if (isLoading) return <div className="text-center p-4">Đang tải...</div>;
    if (!data || data.length === 0) return <div className="text-center p-4">Chưa có dữ liệu</div>;

    // Tự động lấy danh sách cột từ phần tử đầu tiên
    const columns = Object.keys(data[0]);

    // Tự động đoán key ID nếu không truyền vào
    const getRowKey = (item: T, index: number) => {
        if (rowKey) return item[rowKey] as string | number;
        // Tìm key có chứa chữ 'id'
        const autoId = columns.find(key => key.toLowerCase().includes('id') && key.toLowerCase() !== 'categoryid'); // Tránh nhầm foreign key
        return autoId ? item[autoId] : index;
    };

    return (
        <div className="table-container">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-100 border-b">
                <tr>
                    {columns.map((col) => (
                        <th key={col} className="p-3 text-left font-semibold border-r last:border-r-0 uppercase">
                            {col}
                        </th>
                    ))}
                    {(onEdit || onDelete) && <th className="p-3 text-center">Action</th>}
                </tr>
                </thead>
                <tbody>
                {data.map((row, idx) => (
                    <tr key={getRowKey(row, idx)} className="border-b hover:bg-gray-50">
                        {columns.map((col) => (
                            <td key={col} className="p-3 border-r last:border-r-0 max-w-[200px] truncate">
                                {/* Logic hiển thị thông minh */}
                                {(() => {
                                    const val = row[col];
                                    if (typeof val === 'boolean') return val ? '✅' : '❌';
                                    if (String(val).startsWith('http')) return <img src={val} className="h-8 w-8 object-cover rounded" alt="img" />;
                                    if (typeof val === 'object' && val !== null) return JSON.stringify(val); // Array hoặc Object
                                    return String(val);
                                })()}
                            </td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td className="p-3 text-center whitespace-nowrap">
                                {onEdit && <Button  style={{marginRight:5, padding: '2px 8px', fontSize: 12}} onClick={() => onEdit(row)}>Sửa</Button>}
                                {onDelete && <Button  style={{padding: '2px 8px', fontSize: 12}} onClick={() => onDelete(row)}>Xóa</Button>}
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};