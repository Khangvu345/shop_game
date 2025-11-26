export interface ICategory {
    categoryId: number,
    categoryName: string,
    description?: string,
    parentId?: number,
    parentName?: string
}


export interface IProduct {
    productId: number;
    sku: string;
    productName: string;
    description?: string;
    listPrice: number;
    status: string;
    categoryId: number;
    categoryName?: string;
    thumbnailUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}


export interface IProductFilters {
    categoryIds: number[];
    priceRange: 'all' | 'under-1m' | '1m-5m' | '5m-10m' | 'above-10m';
    status: 'all' | 'new' | 'used';
    sortBy: 'default' | 'price-asc' | 'price-desc';
}