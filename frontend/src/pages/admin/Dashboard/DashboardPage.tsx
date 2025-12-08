import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchDashboardStats, setFilter } from '../../../store/slices/AdminBlock/dashboardSlice';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { Select } from '../../../components/ui/input/Select';
import { AdminPageHeader } from '../../../components/features/admin/AdminPageHeader/AdminPageHeader';
import '../../../components/features/admin/AdminPageHeader/AdminPageHeader.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function DashboardPage() {
    const dispatch = useAppDispatch();
    const { stats, status, filter, error } = useAppSelector((state: any) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats(filter));
    }, [dispatch, filter]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilter({ month: Number(e.target.value) }));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilter({ year: Number(e.target.value) }));
    };

    // Format tiền tệ
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    // --- Cấu hình biểu đồ ---


    // 1. Biểu đồ Doughnut: Tỷ lệ Hàng tồn kho (3 loại)
    const inventoryChartData = {
        labels: ['Hàng An Toàn', 'Sắp Hết Hàng (<5)', 'Hết Hàng'],
        datasets: [
            {
                data: stats ? [
                    stats.safeStockCount || 0,     // Hàng an toàn (màu xanh)
                    stats.lowStockCount || 0,      // Sắp hết hàng (màu vàng)
                    stats.outOfStockCount || 0     // Hết hàng (màu đỏ)
                ] : [0, 0, 0],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 2,
            },
        ],
    };

    // 2. Biểu đồ Bar: Phân tích doanh thu (Doanh thu vs Chi phí vs Lợi nhuận)
    const revenueBreakdownChartData = {
        labels: ['Doanh Thu', 'Chi Phí', 'Lợi Nhuận'],
        datasets: [
            {
                label: 'VNĐ',
                data: stats?.revenueBreakdown ? [
                    stats.revenueBreakdown.totalSales,
                    stats.revenueBreakdown.totalCost,
                    stats.revenueBreakdown.totalProfit
                ] : [0, 0, 0],
                backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
            },
        ],
    };

    // 3. Biểu đồ Bar: Hiệu suất (Đơn hàng mới vs Khách hàng mới)
    const metricsChartData = {
        labels: ['Đơn hàng mới', 'Khách hàng mới'],
        datasets: [
            {
                label: 'Số lượng',
                data: stats ? [stats.newOrders, stats.newCustomers] : [0, 0],
                backgroundColor: ['#3b82f6', '#8b5cf6'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' as const },
        },
    };

    if (status === 'loading' && !stats) return <div className="flex-center" style={{ height: '80vh' }}><Spinner /></div>;
    if (error) return <div className="error-text">Lỗi tải thống kê: {error}</div>;

    return (
        <div className="admin-page-container">
            {/* HEADER - 3 columns only */}
            <AdminPageHeader title="Tổng Quan Kinh Doanh" />

            {/* ACTION BAR - Filters */}
            <div className="admin-action-bar">
                <Select
                    value={filter.month}
                    onChange={handleMonthChange}
                    options={Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))}
                    style={{ width: '120px' }}
                />
                <Select
                    value={filter.year}
                    onChange={handleYearChange}
                    options={[
                        { label: '2024', value: 2024 },
                        { label: '2025', value: 2025 },
                    ]}
                    style={{ width: '100px' }}
                />
            </div>

            {/* STAT CARDS */}
            <div className="stats-grid">
                {/* Card 1: Doanh thu */}
                <div className="stat-card revenue">
                    <span className="stat-icon">💰</span>
                    <div className="stat-title">Doanh Thu</div>
                    <div className="stat-value">
                        {stats ? formatCurrency(stats.totalRevenue) : '0 đ'}
                    </div>
                </div>

                {/* Card 2: Đơn hàng */}
                <div className="stat-card orders">
                    <span className="stat-icon">📦</span>
                    <div className="stat-title">Đơn Hàng Mới</div>
                    <div className="stat-value">
                        {stats?.newOrders || 0}
                    </div>
                </div>

                {/* Card 3: Khách hàng */}
                <div className="stat-card customers">
                    <span className="stat-icon">👥</span>
                    <div className="stat-title">Khách Hàng Mới</div>
                    <div className="stat-value">
                        {stats?.newCustomers || 0}
                    </div>
                </div>

                {/* Card 4: Lợi nhuận */}
                <div className="stat-card profit">
                    <span className="stat-icon">📊</span>
                    <div className="stat-title">Lợi Nhuận</div>
                    <div className="stat-value">
                        {stats?.revenueBreakdown ? formatCurrency(stats.revenueBreakdown.totalProfit) : '0 đ'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '5px' }}>
                        ↑ {stats?.revenueBreakdown?.profitMargin?.toFixed(2) || 0}% margin
                    </div>
                </div>


                {/* Card 5: Tồn kho */}
                <div className="stat-card inventory">
                    <span className="stat-icon">🏭</span>
                    <div className="stat-title">Tổng Tồn Kho</div>
                    <div className="stat-value">
                        {stats?.totalInventory?.toLocaleString() || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '8px', lineHeight: '1.5' }}>
                        <div style={{ color: '#10b981' }}>✓ {stats?.safeStockCount || 0} sản phẩm an toàn</div>
                        <div style={{ color: '#f59e0b' }}>⚠ {stats?.lowStockCount || 0} sản phẩm sắp hết</div>
                        <div style={{ color: '#ef4444' }}>✕ {stats?.outOfStockCount || 0} sản phẩm hết hàng</div>
                    </div>
                </div>
            </div>

            {/* CHARTS */}
            <div className="charts-section">
                {/* Chart 1: Phân tích doanh thu */}
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.1rem' }}>Phân Tích Doanh Thu</h3>
                    <div style={{ height: '250px' }}>
                        <Bar data={revenueBreakdownChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Chart 2: Sức khỏe kho hàng */}
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.1rem' }}>Tình Trạng Kho Hàng</h3>
                    <div style={{ height: '250px' }}>
                        <Doughnut data={inventoryChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Chart 3: Chỉ số tăng trưởng */}
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.1rem' }}>Hiệu Suất Tháng {filter.month}</h3>
                    <div style={{ height: '250px' }}>
                        <Bar data={metricsChartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}