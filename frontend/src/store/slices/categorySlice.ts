import { categoryApi } from '../../api/categoryApi';
import {type ICategory } from '../../types';
import { createGenericSlice } from './GenericSlice';

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