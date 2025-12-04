import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchDashboardStats, setFilter } from '../../../store/slices/AdminBlock/dashboardSlice';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { Select } from '../../../components/ui/input/Select';
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

    // 1. Biểu đồ Doughnut: Tỷ lệ Hàng tồn kho vs Hàng sắp hết
    const inventoryChartData = {
        labels: ['Hàng an toàn', 'Sắp hết hàng (<5)'],
        datasets: [
            {
                data: stats ? [
                    Number(stats.totalInventory) - (stats.lowStockCount || 0), // Giả định totalInventory là tổng số lượng, lowStock là số sản phẩm
                    stats.lowStockCount
                ] : [0, 0],
                backgroundColor: ['#10b981', '#ef4444'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 2,
            },
        ],
    };


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

    if (status === 'loading' && !stats) return <div className="flex-center" style={{height: '80vh'}}><Spinner /></div>;
    if (error) return <div className="error-text">Lỗi tải thống kê: {error}</div>;

    return (
        <div className="dashboard-container">
            {/* HEADER & FILTERS */}
            <div className="dashboard-header">
                <div>
                    <h2 style={{margin: 0}}>Tổng Quan Kinh Doanh</h2>
                    <p style={{color: '#666', margin: '5px 0 0'}}>
                        Dữ liệu tháng {filter.month}/{filter.year}
                    </p>
                </div>

                <div className="dashboard-filters">
                    <Select
                        value={filter.month}
                        onChange={handleMonthChange}
                        options={Array.from({length: 12}, (_, i) => ({ label: `Tháng ${i+1}`, value: i+1 }))}
                        style={{width: '120px'}}
                    />
                    <Select
                        value={filter.year}
                        onChange={handleYearChange}
                        options={[
                            { label: '2024', value: 2024 },
                            { label: '2025', value: 2025 },
                        ]}
                        style={{width: '100px'}}
                    />
                </div>
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

                {/* Card 4: Tồn kho */}
                <div className="stat-card inventory">
                    <span className="stat-icon">🏭</span>
                    <div className="stat-title">Tổng Tồn Kho</div>
                    <div className="stat-value">
                        {stats?.totalInventory?.toLocaleString() || 0}
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#ef4444', marginTop: '5px'}}>
                        ⚠ {stats?.lowStockCount} sản phẩm sắp hết
                    </div>
                </div>
            </div>

            {/* CHARTS */}
            <div className="charts-section">
                {/* Chart 1: Sức khỏe kho hàng */}
                <div className="chart-container">
                    <h3 style={{textAlign: 'center', marginBottom: '15px', fontSize: '1.1rem'}}>Tình Trạng Kho Hàng</h3>
                    <div style={{height: '250px'}}>
                        <Doughnut data={inventoryChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Chart 2: Chỉ số tăng trưởng */}
                <div className="chart-container">
                    <h3 style={{textAlign: 'center', marginBottom: '15px', fontSize: '1.1rem'}}>Hiệu Suất Tháng {filter.month}</h3>
                    <div style={{height: '250px'}}>
                        <Bar data={metricsChartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}