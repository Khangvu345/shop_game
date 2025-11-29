import type {TModerationStatus, TProductStatus, TReviewVisibility} from "./common.types.ts";

export interface ICategory {
    categoryId: number,
    categoryName: string,
    description?: string,

    parentId?: number,
    parentName?: string
    children?: ICategory[];
}


export interface IProduct {
    productId: number;
    sku: string;
    productName: string;
    description?: string;
    listPrice: number;
    status: TProductStatus;

    createdAt?: string;
    updatedAt?: string;


    stockQuantity: number;
    purchasePrice?: number;

    categoryId: number;
    categoryName?: string;
    thumbnailUrl?: string;
    suppliers?: ISupplier[];
}

export interface ISupplier {
    supplierId: number;
    name: string;
    contactEmail: string;
    contactPhone?: string;
}

export interface IProductReview {
    reviewId: number;
    productId: number;
    partyId: number;
    rating: number;
    comment?: string;
    createdAt: string;
    lastEditedAt?: string;
    visibilityStatus: TReviewVisibility;

    partyName?: string;
    replies?: IReviewReply[];
}

export interface IReviewReply {
    replyId: number;
    reviewId: number;
    partyId: number;
    comment: string;
    createdAt: string;
    isFromStaff?: boolean;
}

export interface IReviewModeration {
    moderationId: number;
    reviewId: number;
    moderatorPartyId: number;
    status: TModerationStatus;
    reasonCode?: string;
    notes?: string;
    createdAt: string;
    decidedAt?: string;
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