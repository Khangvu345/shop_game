import {fetchCategories, addCategory , updateCategory, deleteCategory} from "../../store/slices/ProductBlock/categorySlice.ts";
import {AdminManage} from "../../components/features/admin/AdminManager/AdminManage.tsx";
import type {ICategory, IColumn, IFieldConfig} from "../../types";

export function ManageCategoriesPage() {


    const columns: IColumn<ICategory>[] = [
        {title: 'Mã Danh Mục', key: 'categoryId' },
        {title: 'Tên Danh Mục', key: 'categoryName' },
        {title: 'Mô tả' ,key: "description"},
        {title: 'Danh mục cha', key: "parentName"}
    ]

    const formFields: IFieldConfig<ICategory>[] = [
        {
            label: 'Tên Danh Mục:',
            name: 'categoryName', type: 'text',
            required: true
        },
        {
            label: 'Mô tả:',
            name: 'description',
            type: 'textarea',
            required: false
        },
        {
            label: 'Danh mục cha:',
            name: 'parentId',
            type: 'select',
            options: [
                { label: 'Máy Chơi Game', value: '1' },
                { label: 'Game Các Hệ Máy', value: '2' },
                { label: 'Linh Phụ Kiện', value: '3' },
                { label: 'Thẻ Gift Card & Amiibo', value: '4' }

            ],
            required: false
        }
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