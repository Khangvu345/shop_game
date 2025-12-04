
export interface IPeriod {
    type: 'MONTH' | 'QUARTER' | 'YEAR';
    month?: number;
    year?: number;
    quarter?: number;
}

export interface IDashboardStats {
    totalRevenue: number;
    newOrders: number;
    newCustomers: number;
    totalInventory: number;
    lowStockCount: number;
    period: IPeriod;
    lastUpdated: string;
}

export interface IDashboardFilter {
    month?: number;
    year?: number;
    quarter?: number;
}