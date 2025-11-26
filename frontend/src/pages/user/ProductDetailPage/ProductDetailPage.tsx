import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProductById } from '../../../store/slices/productSlice';
import { addItem } from '../../../store/slices/cartSlice';
import { Spinner } from '../../../components/ui/loading/Spinner';
import type { IProduct } from '../../../types';

import './ProductDetailPage.css';

// Hàm format tiền VNĐ
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Component hiển thị sao đánh giá
interface StarRatingProps {
    rating: number;
    maxRating?: number;
}

function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
        stars.push(
            <span key={i} className={`star ${i <= rating ? '' : 'empty'}`}>
                ★
            </span>
        );
    }
    return <div className="stars">{stars}</div>;
}

// Component Accordion Item
interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="accordion-title">{title}</h3>
                <span className="accordion-icon">▼</span>
            </div>
            <div className="accordion-content">{children}</div>
        </div>
    );
}

// Mock data cho reviews (vì chưa có API)
const mockReviews = [
    {
        review_id: '1',
        party_name: 'Trần Văn A',
        rating: 5,
        comment: 'Máy PS5 Pro chạy cực mượt, đồ họa đẹp long lanh, đáng tiền từng đồng! Đặc biệt Ray Tracing + 120fps quá đỉnh!',
        created_at: '2025-11-23T10:15:00',
        replies: [
            {
                reply_id: '1',
                party_name: 'Shop Game',
                comment: 'Cảm ơn anh A đã tin tưởng Shop Game! Chúc anh trải nghiệm game 4K/120fps thật đã với PS5 Pro nhé!',
                is_from_staff: true,
                created_at: '2025-11-23T11:20:00',
            },
        ],
    },
    {
        review_id: '2',
        party_name: 'Nguyễn Thị B',
        rating: 4,
        comment: 'Sản phẩm tốt, giao hàng nhanh. Chỉ tiếc là không có thêm game đi kèm.',
        created_at: '2025-11-22T18:30:00',
        replies: [],
    },
    {
        review_id: '3',
        party_name: 'Lê Hoàng C',
        rating: 5,
        comment: 'Mua về chơi God of War Ragnarök quá mượt, không hề có hiện tượng giật lag. Recommend cho mọi người!',
        created_at: '2025-11-21T09:00:00',
        replies: [],
    },
];

// Mock images cho gallery
const mockImages = [
    '/assets/images/products/1.png',
    '/assets/images/logo.png',
    '/assets/images/logo.png',
    '/assets/images/products/1.png',
];

// Parse specifications từ description
function parseSpecifications(description: string | undefined): { label: string; value: string }[] {
    if (!description) return [];

    const specs: { label: string; value: string }[] = [];
    const lines = description.split('\n');

    for (const line of lines) {
        if (line.includes(':') && line.startsWith('-')) {
            const [label, ...valueParts] = line.substring(1).split(':');
            if (label && valueParts.length > 0) {
                specs.push({
                    label: label.trim(),
                    value: valueParts.join(':').trim(),
                });
            }
        }
    }

    return specs.slice(0, 10); // Giới hạn 10 specs
}

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const { selectedProduct } = useAppSelector((state) => state.products);
    const { data: product, status, error } = selectedProduct;

    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [id, dispatch]);

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                dispatch(addItem(product));
            }
            alert(`Đã thêm ${quantity} ${product.productName} vào giỏ hàng!`);
        }
    };

    // Loading state
    if (status === 'loading') {
        return (
            <div className="product-detail-page">
                <div className="product-detail-loading">
                    <Spinner type="spinner1" />
                    <p>Đang tải thông tin sản phẩm...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (status === 'failed') {
        return (
            <div className="product-detail-page">
                <div className="product-detail-error">
                    <h2>Có lỗi xảy ra</h2>
                    <p>{error || 'Không thể tải thông tin sản phẩm'}</p>
                    <Link to="/products" className="back-link">
                        ← Quay lại danh sách sản phẩm
                    </Link>
                </div>
            </div>
        );
    }

    // No product found
    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-error">
                    <h2>Không tìm thấy sản phẩm</h2>
                    <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Link to="/products" className="back-link">
                        ← Quay lại danh sách sản phẩm
                    </Link>
                </div>
            </div>
        );
    }

    const specifications = parseSpecifications(product.description);
    const images = product.thumbnailUrl ? [product.thumbnailUrl, ...mockImages.slice(1)] : mockImages;

    // Tính rating trung bình từ mock reviews
    const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;
    const totalReviews = mockReviews.length;

    // Tính phân bố rating
    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: mockReviews.filter((r) => r.rating === star).length,
        percentage: (mockReviews.filter((r) => r.rating === star).length / totalReviews) * 100,
    }));

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span className="breadcrumb-separator">/</span>
                <Link to="/products">Sản phẩm</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{product.productName}</span>
            </nav>

            {/* Hero Section */}
            <section className="product-hero">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img
                            src={images[selectedImageIndex]}
                            alt={product.productName}
                            className="main-image"
                        />
                    </div>
                    <div className="thumbnail-list">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail-item ${index === selectedImageIndex ? 'active' : ''}`}
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <img src={img} alt={`${product.productName} - Ảnh ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h1 className="product-title">{product.productName}</h1>

                    <div className="product-rating">
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="rating-text">
                            {averageRating.toFixed(1)} ({totalReviews} Reviews)
                        </span>
                    </div>

                    <p className="product-price">{formatCurrency(product.listPrice)}</p>

                    <p className="product-short-description">
                        {product.description
                            ? product.description.split('\n').slice(0, 3).join(' ').substring(0, 200) + '...'
                            : 'Sản phẩm chính hãng, bảo hành đầy đủ. Liên hệ shop để được tư vấn chi tiết.'}
                    </p>

                    <div className="product-actions">
                        <div className="quantity-selector">
                            <span className="quantity-label">Số lượng:</span>
                            <div className="quantity-controls">
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </section>

            {/* More Details Section */}
            <section className="more-details-section">
                <h2 className="section-title">Thông tin chi tiết</h2>

                <div className="accordion">
                    {specifications.length > 0 && (
                        <AccordionItem title="Thông số kỹ thuật" defaultOpen={true}>
                            <div className="specifications-grid">
                                {specifications.map((spec, index) => (
                                    <div key={index} className="spec-item">
                                        <span className="spec-label">{spec.label}</span>
                                        <span className="spec-value">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                    )}

                    <AccordionItem title="Mô tả đầy đủ">
                        <div className="full-description">
                            {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                        </div>
                    </AccordionItem>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="reviews-section">
                <div className="reviews-header">
                    <h2 className="section-title">Đánh giá từ khách hàng</h2>
                </div>

                {/* Reviews Summary */}
                <div className="reviews-summary">
                    <div className="average-rating">
                        <span className="rating-number">{averageRating.toFixed(1)}</span>
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="rating-total">{totalReviews} đánh giá</span>
                    </div>

                    <div className="rating-bars">
                        {ratingDistribution.map(({ star, count, percentage }) => (
                            <div key={star} className="rating-bar-item">
                                <span className="rating-bar-label">{star} sao</span>
                                <div className="rating-bar">
                                    <div
                                        className="rating-bar-fill"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="rating-bar-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review List */}
                <div className="review-list">
                    {mockReviews.length > 0 ? (
                        mockReviews.map((review) => (
                            <div key={review.review_id} className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">
                                            {review.party_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="reviewer-name">{review.party_name}</div>
                                            <div className="review-date">
                                                {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="review-rating">
                                        <StarRating rating={review.rating} />
                                    </div>
                                </div>

                                <div className="review-content">
                                    <p className="review-text">{review.comment}</p>
                                </div>

                                {/* Replies */}
                                {review.replies.length > 0 && (
                                    <div className="review-replies">
                                        {review.replies.map((reply) => (
                                            <div key={reply.reply_id} className="reply-item">
                                                <div className="reply-header">
                                                    <span className="reviewer-name">{reply.party_name}</span>
                                                    {reply.is_from_staff && (
                                                        <span className="staff-badge">Nhân viên</span>
                                                    )}
                                                    <span className="review-date">
                                                        {new Date(reply.created_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <p className="reply-text">{reply.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-reviews">
                            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                            <p>Hãy là người đầu tiên đánh giá!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}