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




export interface IServerProductFilters {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
}



export interface IProductFilters {
    page: number;
    limit: number;
    sortBy: 'default' | 'price-asc' | 'price-desc';
}