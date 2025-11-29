import {fetchCategories, addCategory , updateCategory, deleteCategory} from "../../store/slices/categorySlice.ts";
import {AdminManage} from "../../components/features/admin/AdminManager/AdminManage.tsx";
import type {ICategory, IColumn, IFieldConfig} from "../../types";

export function ManageCategoriesPage() {
    const columns: IColumn<ICategory>[] = [
        {title: 'Mã Danh Mục', key: 'categoryId' },
        {title: 'Tên Danh Mục', key: 'categoryName' },
        {title: 'Mô tả' ,key: "description"}
    ]

    const formFields: IFieldConfig<ICategory>[] = [
        {
            label: 'Tên Danh Mục',
            name: 'categoryName', type: 'text',
            required: true
        },

    ]

    return (
        <AdminManage
            title={'Quản Lý Danh Mục'}
            idKey={'categoryId'}
            columns={columns}
            formFields={formFields}
            stateSelector={(state) => state.categories}
            actions={{
                fetchAll: fetchCategories,
                create: addCategory,
                update: updateCategory,
                delete: deleteCategory}}
        >
        </AdminManage>

    );
}