import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { HomePage } from '../pages/user/HomePage/HomePage';
import { ProductListPage } from '../pages/user/ProductListPage/ProductListPage';
import {CartPage} from "../pages/user/CartPage/CartPage.tsx";
import { ProductDetailPage } from '../pages/user/ProductDetailPage/ProductDetailPage'; 
import {AdminLayout} from "../components/layout/AdminLayout/AdminLayout.tsx";
import {ManageProductsPage} from "../pages/admin/ManageProductsPage.tsx";
import {ManageCategoriesPage} from "../pages/admin/ManageCategoriesPage.tsx";
import {ManageSupplierPage} from "../pages/admin/ManageSupplierPage.tsx";
import {AdminRoute, AuthRoute, LoggedInRoute} from "./ProtectedRoute.tsx";
import {CheckoutPage} from "../pages/user/CheckOut/CheckOut.tsx";
import {OrderHistoryPage} from "../pages/user/OrderHistoryPage/OrderHistoryPage.tsx";
import {OrderDetailPage} from "../pages/user/OrderDetail/OrderDetailPage.tsx";
import {DashboardPage} from "../pages/admin/Dashboard/DashboardPage.tsx";
import {ManageGoodsReceiptPage} from "../pages/admin/GoodsReceipt/ManageGoodsReceiptPage.tsx";
import {CreateGoodsReceiptPage} from "../pages/admin/GoodsReceipt/CreateGoodsReceiptPage.tsx";
import {GoodsReceiptDetailPage} from "../pages/admin/GoodsReceipt/GoodsReceiptDetailPage.tsx";
import {ManageOrderPage} from "../pages/admin/Order/ManageOrderPage.tsx";
import {AdminOrderDetailPage} from "../pages/admin/Order/AdminOrderDetailPage.tsx";
import { UserProfilePage } from '../pages/user/UserProfilePage/UserProfilePage';
import { ManageCustomersPage } from '../pages/admin/ManageCustomersPage';
import { ManageStockMovementPage } from '../pages/admin/ManageStockMovementPage';

import { AuthPage } from '../pages/auth/AuthPage.tsx';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route element={<LoggedInRoute/>}>
                    <Route path="cart" element={<CartPage />} />
                    <Route path='checkout' element={<CheckoutPage/>}/>
                    <Route path='my-orders' element={<OrderHistoryPage/>}/>
                    <Route path='my-orders/:id' element={<OrderDetailPage/>}/>
                    <Route path='profile' element={<UserProfilePage/>} />
                </Route>
            </Route>
            <Route path="/auth" element={<AuthRoute/>}>
                <Route path={'login'} element={<AuthPage />} />
                <Route path={'register'} element={<AuthPage />} /> {/* Thêm dòng này */}
            </Route>
            <Route element={<AdminRoute/>}>
                <Route path='/admin' element={<AdminLayout />}>
                    <Route index element={<DashboardPage/>} />
                    <Route path='dashboard' element={<DashboardPage />} />
                    <Route path='products' element={<ManageProductsPage/>} />
                    <Route path='categories' element={<ManageCategoriesPage />} />
                    <Route path='suppliers' element={<ManageSupplierPage/>} />
                    <Route path='goods-receipts' element={<ManageGoodsReceiptPage/>} />
                    <Route path='goods-receipts/create' element={<CreateGoodsReceiptPage/>} />
                    <Route path='goods-receipts/:id' element={<GoodsReceiptDetailPage/>} />
                    <Route path='orders' element={<ManageOrderPage />} />
                    <Route path='orders/:id' element={<AdminOrderDetailPage />} />
                    <Route path='users' element={<ManageCustomersPage />} />
                    <Route path='stock-movements' element={<ManageStockMovementPage />} />
                </Route>
            </Route>
        </Routes>    );
}