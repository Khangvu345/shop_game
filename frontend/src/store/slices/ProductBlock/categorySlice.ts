import { categoryApi } from '../../../api/ProductBlock/categoryApi.ts';
import {type ICategory } from '../../../types';
import { createGenericSlice } from '../GenericSlice.ts';

const CategorySlice = createGenericSlice<ICategory>(
    'categories',
    categoryApi,
    'categoryId'
);

export const {
    fetchAll: fetchCategories,
    create: addCategory,
    update: updateCategory,
    remove: deleteCategory
} = CategorySlice.actions;

export default CategorySlice.reducer;