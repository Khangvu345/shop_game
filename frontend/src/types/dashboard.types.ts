
export interface IPeriod {
    type: 'MONTH' | 'QUARTER' | 'YEAR';
    month?: number;
    year?: number;
    quarter?: number;
}

export interface IRevenueBreakdown {
    totalSales: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
}

export interface IDashboardStats {
    totalRevenue: number;
    newOrders: number;
    newCustomers: number;
    totalInventory: number;
    lowStockCount: number;
    revenueBreakdown: IRevenueBreakdown;
    period: IPeriod;
    lastUpdated: string;
}

export interface IDashboardFilter {
    month?: number;
    year?: number;
    quarter?: number;
}