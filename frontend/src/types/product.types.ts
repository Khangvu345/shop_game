import type {
    TModerationStatus,
    TProductStatus,
    TReviewVisibility,
} from './common.types';
import type { IEmployee, IParty } from './people.types';

export interface ICategory {
    category_id: string;
    category_name: string;
    description?: string;
    parent_id?: string;

    parent?: ICategory;
    children?: ICategory[];
}

export interface ISupplier {
    supplier_id: string;
    name: string;
    contact_email?: string;
    contact_phone?: string;
}

export interface IProduct {
    product_id: string;
    sku?: string;
    product_name: string;
    description?: string;
    list_price: number;
    status: TProductStatus;
    category_id: string;
    created_at: string;
    updated_at: string;

    category?: ICategory;
    reviews?: IProductReview[];
    suppliers?: ISupplier[];
}

export interface IProductReview {
    review_id: string;
    product_id: string;
    party_id: string;
    rating: number; // 1-5
    comment?: string;
    created_at: string;
    last_edited_at?: string;
    visibility_status: TReviewVisibility;

    party?: Pick<IParty, 'party_id' | 'full_name'>; // Thông tin người viết
    replies?: IReviewReply[];
    moderation?: IReviewModeration;
}


export interface IReviewReply {
    reply_id: string;
    review_id: string;
    party_id: string;
    comment: string;
    created_at: string;
    is_from_staff?: boolean;

    party?: Pick<IParty, 'party_id' | 'full_name'>;
}

export interface IReviewModeration {
    moderation_id: string;
    review_id: string;
    moderator_party_id: string; // ID của Employee
    status: TModerationStatus;
    reason_code?: string;
    notes?: string;
    created_at: string;
    decided_at?: string;

    moderator?: Pick<IEmployee, 'party_id' | 'full_name'>;
}

export interface IReviewEditHistory {
    edit_id: string;
    review_id: string;
    edited_by_party_id: string;
    old_rating?: number;
    old_comment?: string;
    new_rating?: number;
    new_comment?: string;
    edited_at: string;
    change_note?: string;
}

export interface IProductFilters {
    categoryIds: string[]; // Mảng chứa các category_id được chọn
    priceRange: 'all' | 'under-1m' | '1m-5m' | '5m-10m' | 'above-10m';
    status: 'all' | 'new' | 'used';
}