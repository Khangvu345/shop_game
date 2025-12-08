import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchDashboardStats, setFilter } from '../../../store/slices/AdminBlock/dashboardSlice';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { Select } from '../../../components/ui/input/Select';
import { AdminPageHeader } from '../../../components/features/admin/AdminPageHeader/AdminPageHeader';
import '../../../components/features/admin/AdminPageHeader/AdminPageHeader.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

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
                    stats.safeStockCount || 0,
                    stats.lowStockCount || 0,
                    stats.outOfStockCount || 0
                ] : [0, 0, 0],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 2,
            },
        ],
    };

    // 2. Biểu đồ Bar: Phân tích doanh thu
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

    // 3. Biểu đồ Line: Dòng Tiền
    const cashFlowChartData = {
        labels: ['Thu Vào', 'Chi Ra', 'Ròng'],
        datasets: [
            {
                label: 'Dòng Tiền (VNĐ)',
                data: stats?.cashFlow ? [
                    stats.cashFlow.cashIn,
                    stats.cashFlow.cashOut,
                    stats.cashFlow.netCashFlow
                ] : [0, 0, 0],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: (context: any) => {
                    const index = context.dataIndex;
                    if (index === 0) return '#10b981'; // Thu vào
                    if (index === 1) return '#ef4444'; // Chi ra
                    if (index === 2) {
                        return stats?.cashFlow?.netCashFlow >= 0 ? '#10b981' : '#ef4444';
                    }
                    return '#3b82f6';
                },
                pointRadius: 8,
                pointHoverRadius: 10,
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
            <AdminPageHeader title="Tổng Quan Kinh Doanh" />

            {/* ACTION BAR - Filters */}
            <div className="admin-action-bar">
                <Select
                    value={filter.month}
                    onChange={handleMonthChange}
                    options={Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))}
                    style={{ width: '140px' }}
                />
                <Select
                    value={filter.year}
                    onChange={handleYearChange}
                    options={[
                        { label: '2024', value: 2024 },
                        { label: '2025', value: 2025 },
                    ]}
                    style={{ width: '120px' }}
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

                {/* Card 2: Đơn chờ xử lý */}
                <div className="stat-card orders">
                    <span className="stat-icon">📦</span>
                    <div className="stat-title">Đơn Chờ Xử Lý</div>
                    <div className="stat-value">
                        {stats?.newOrders || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '3px' }}>
                        (Chờ xử lý + Đã xác nhận)
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

                {/* Card 6: Chi Nhập Hàng */}
                <div className="stat-card expenses">
                    <span className="stat-icon">💸</span>
                    <div className="stat-title">Chi Nhập Hàng</div>
                    <div className="stat-value">
                        {stats?.capitalManagement
                            ? formatCurrency(stats.capitalManagement.totalGoodsReceiptCost)
                            : '0 đ'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '3px' }}>
                        Tháng {filter.month}/{filter.year}
                    </div>
                </div>

                {/* Card 7: Giá Trị Tồn Kho */}
                <div className="stat-card inventory-value">
                    <span className="stat-icon">🏦</span>
                    <div className="stat-title">Giá Trị Tồn Kho</div>
                    <div className="stat-value">
                        {stats?.capitalManagement
                            ? formatCurrency(stats.capitalManagement.inventoryValue)
                            : '0 đ'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '3px' }}>
                        Vốn đang trong kho
                    </div>
                </div>

                {/* Card 8: Cash Flow Ròng */}
                <div className={`stat-card cash-flow ${stats?.cashFlow?.netCashFlow >= 0 ? 'positive' : 'negative'
                    }`}>
                    <span className="stat-icon">🪙</span>
                    <div className="stat-title">Dòng tiền Ròng</div>
                    <div className="stat-value">
                        {stats?.cashFlow
                            ? formatCurrency(stats.cashFlow.netCashFlow)
                            : '0 đ'}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: stats?.cashFlow?.netCashFlow >= 0 ? '#10b981' : '#ef4444',
                        marginTop: '3px',
                        fontWeight: 'bold'
                    }}>
                        {stats?.cashFlow?.netCashFlow >= 0 ? '↑ Dương' : '↓ Âm'}
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

                {/* Chart 2: Tình trạng kho hàng */}
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.1rem' }}>Tình Trạng Kho Hàng</h3>
                    <div style={{ height: '250px' }}>
                        <Doughnut data={inventoryChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Chart 3: Dòng Tiền */}
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.1rem' }}>
                        Dòng Tiền Tháng {filter.month}
                    </h3>
                    <div style={{ height: '250px' }}>
                        <Line data={cashFlowChartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}