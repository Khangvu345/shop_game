import React, { useMemo } from 'react';
import { Button } from '../../ui/button/Button.tsx';
import {Spinner} from "../../ui/loading/Spinner.tsx";

export interface IColumn<T> {
    title: string;
    key: keyof T;
    width?: string;
    render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T extends object> {
    columns?: IColumn<T>[];
    data: T[];
    isLoading?: boolean;
    rowKey?: (item: T) => string | number;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export function AdminTable<T extends object>({columns, data, isLoading, rowKey, onEdit, onDelete}: AdminTableProps<T>){

    const tableColumns = useMemo(() => {
        // 1. Nếu người dùng truyền columns -> Dùng cái đó (ưu tiên cao nhất)
        if (columns && columns.length > 0) {
            return columns;
        }

        // 2. Nếu không truyền -> Tự động quét keys từ dòng dữ liệu đầu tiên
        if (data && data.length > 0) {
            // Lấy tất cả các key của object đầu tiên (ví dụ: id, name, price...)
            const keys = Object.keys(data[0]) as Array<keyof T>;

            return keys.map((key) => ({
                title: String(key), // Tên cột chính là tên key
                key: key,
                // Hàm render mặc định: Nếu là ảnh (url) thì hiện ảnh, nếu là object thì stringify
                render: (item: T) => {
                    const val = item[key];
                    if (typeof val === 'string' && val.startsWith('http')) {
                        return <img src={val} alt="img" style={{height: 40, borderRadius: 4}} />;
                    }
                    if (typeof val === 'object' && val !== null) {
                        return JSON.stringify(val); // Object lồng nhau thì hiện chuỗi JSON
                    }
                    return val as React.ReactNode;
                }
            }));
        }

        return []; // Không có dữ liệu thì không có cột
    }, [columns, data]);

    // Hàm lấy ID mặc định nếu không truyền rowKey
    const getRowKey = (item: T, index: number) => {
        if (rowKey) return rowKey(item);
        // Tự đoán ID: tìm trường nào có chữ 'id' hoặc 'Id'
        const idKey = Object.keys(item).find(k => k.toLowerCase().includes('id') || k.toLowerCase().includes('key'));
        if (idKey) return (item as never)[idKey];
        return index; // Cùng lắm thì dùng index
    };

    if (isLoading) return <Spinner></Spinner>;
    if (!data || data.length === 0) return <div>Chưa có dữ liệu</div>;

    return (
        <div>
            <table>
                <thead>
                <tr>
                    {/* VÒNG LẶP 1: Render tiêu đề cột từ danh sách tự động */}
                    {tableColumns.map((col, index) => (
                        <th key={String(col.key) + index}>
                            {col.title.toUpperCase()}
                        </th>
                    ))}
                    {(onEdit || onDelete) && <th>THAO TÁC</th>}
                </tr>
                </thead>

                <tbody>
                {/* VÒNG LẶP 2: Render từng dòng dữ liệu */}
                {data.map((row, rowIndex) => (
                    <tr key={getRowKey(row, rowIndex)}>

                        {/* VÒNG LẶP 3 (LỒNG NHAU): Render từng ô dựa trên danh sách cột */}
                        {tableColumns.map((col, colIndex) => (
                            <td key={colIndex}>
                                {col.render
                                    ? col.render(row)
                                    : String(row[col.key])
                                }
                            </td>
                        ))}

                        {(onEdit || onDelete) && (
                            <td>
                                {onEdit && (
                                    <Button onClick={() => onEdit(row)}>
                                        Sửa
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button onClick={() => onDelete(row)}>
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