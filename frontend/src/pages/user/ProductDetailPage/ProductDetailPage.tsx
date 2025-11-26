import { Link } from 'react-router-dom';
import { useProductDetail } from '../../../hooks/useProductDetail';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { AccordionItem } from '../../../components/ui/accordion/AccordionItem';
import { ProductGallery } from '../../../components/features/product/ProductGallery/ProductGallery';
import { ProductInfo } from '../../../components/features/product/ProductInfo/ProductInfo';
import { ProductReviews } from '../../../components/features/product/ProductReviews/ProductReviews';

import './ProductDetailPage.css';

// Mock images cho gallery
const mockImages = [
    'https://placehold.co/600x600?text=PS5+Image+1',
    'https://placehold.co/600x600?text=PS5+Image+2',
    'https://placehold.co/600x600?text=PS5+Image+3',
    'https://placehold.co/600x600?text=PS5+Image+4',
];

// Mock reviews data (sẽ thay bằng API sau)
const mockReviews = [
    { review_id: '1', party_name: 'Trần Văn A', rating: 5, comment: 'Tuyệt vời!', created_at: '2025-11-23T10:15:00', replies: [] },
    { review_id: '2', party_name: 'Nguyễn Thị B', rating: 4, comment: 'Sản phẩm tốt', created_at: '2025-11-22T18:30:00', replies: [] },
    { review_id: '3', party_name: 'Lê Hoàng C', rating: 5, comment: 'Recommend!', created_at: '2025-11-21T09:00:00', replies: [] },
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

    return specs.slice(0, 10);
}

/**
 * ProductDetailPage
 * Trang hiển thị chi tiết sản phẩm - Đã được refactor để dễ maintain
 */
export function ProductDetailPage() {
    // Custom hook xử lý toàn bộ logic
    const {
        product,
        status,
        error,
        quantity,
        selectedImageIndex,
        handleQuantityChange,
        handleAddToCart,
        handleSelectImage,
    } = useProductDetail();

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

    // Prepare data
    const specifications = parseSpecifications(product.description);
    const images = product.thumbnailUrl ? [product.thumbnailUrl, ...mockImages.slice(1)] : mockImages;

    // Tính toán reviews statistics
    const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;
    const totalReviews = mockReviews.length;
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
                <ProductGallery
                    images={images}
                    productName={product.productName}
                    selectedImageIndex={selectedImageIndex}
                    onSelectImage={handleSelectImage}
                />

                <ProductInfo
                    productName={product.productName}
                    listPrice={product.listPrice}
                    description={product.description}
                    averageRating={averageRating}
                    totalReviews={totalReviews}
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    onAddToCart={handleAddToCart}
                />
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
            <ProductReviews
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingDistribution={ratingDistribution}
            />
        </div>
    );
}