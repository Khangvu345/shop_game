import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { HomePage } from '../pages/user/HomePage/HomePage';
import { ProductListPage } from '../pages/user/ProductListPage/ProductListPage';
import {CartPage} from "../pages/user/CartPage/CartPage.tsx";
import { ProductDetailPage } from '../pages/user/ProductDetailPage/ProductDetailPage'; 
import {AdminLayout} from "../components/layout/AdminLayout/AdminLayout.tsx";
import {ManageProductsPage} from "../pages/admin/ManageProductsPage.tsx";
// import { ProductDetailPage } from '../pages/ProductDetailPage'; // Sẽ thêm sau

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
            </Route>

            <Route path='/admin' element={<AdminLayout />}>
                <Route index element={<ManageProductsPage/>} />
                <Route path='products' element={<ManageProductsPage/>} />
            </Route>
        </Routes>    );
};