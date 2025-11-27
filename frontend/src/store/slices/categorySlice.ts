import { categoryApi } from '../../api/categoryApi';
import {type ICategory } from '../../types';
import { createGenericSlice } from './GenericSlice';

const generatedCategorySlice = createGenericSlice<ICategory>(
    'categories',
    categoryApi,
    'categoryId'
);

export const {
    fetchAll: fetchCategories,
    create: addCategory,
    update: updateCategory,
    remove: deleteCategory
} = generatedCategorySlice.actions;

export default generatedCategorySlice.reducer;