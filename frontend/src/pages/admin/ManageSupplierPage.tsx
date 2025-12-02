import {AdminManage} from "../../components/features/admin/AdminManager/AdminManage.tsx";
import type {ISupplier, IColumn, IFieldConfig} from "../../types";
import {fetchSuppliers, deletSupplier,updateSupplier,addSupplier}  from "../../store/slices/ProductBlock/supplierSilce.ts";

export function ManageSupplierPage() {
    const columns: IColumn<ISupplier>[] = [
        {title: 'Mã Nhà Cung Cấp', key: 'supplierId' },
        {title: 'Tên Nhà Cung Cấp', key: 'name' },
        {title: 'Mail Liên Hệ' ,key: 'contactEmail'},
        {title: 'Số Điện Thoại' ,key: 'contactPhone'}
    ]

    const formFields: IFieldConfig<ISupplier>[] = [
        {label: 'Tên Nhà Cung Cấp', name: 'name', type: 'text'},
        {label: 'Mail Liên Hệ', name: 'contactEmail', type: 'email'},
        {label: 'Số Điện Thoại', name: 'contactPhone', type: 'text'}
    ];

    return (
        <AdminManage
            title={'Quản Lý Nhà Cung Cấp'}
            idKey={'supplierId'}
            columns={columns}
            formFields={formFields}
            stateSelector={(state) => state.suppliers}
            actions={{
                fetchAll: fetchSuppliers,
                create: addSupplier,
                update: updateSupplier,
                delete: deletSupplier
            }}
        >
        </AdminManage>);
}