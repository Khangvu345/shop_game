import { Link } from 'react-router-dom';
import { useProductDetail } from '../../../hooks/useProductDetail';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { AccordionItem } from '../../../components/ui/accordion/AccordionItem';
import { ProductGallery } from '../../../components/features/product/ProductGallery/ProductGallery';
import { ProductInfo } from '../../../components/features/product/ProductInfo/ProductInfo';
import { ProductReviews } from '../../../components/features/product/ProductReviews/ProductReviews';

import './ProductDetailPage.css';



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
    // Chỉ sử dụng ảnh chính từ database
    const images = product.productImageUrl ? [product.productImageUrl] : ['https://placehold.co/600x600?text=No+Image'];

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
                    status={product.status}
                    stockQuantity={product.stockQuantity}
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
                        <AccordionItem title="Thông tin cơ bản" defaultOpen={true}>
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
                            {(() => {
                                const description = product.description || '';
                                const lines = description.split('\n').flatMap(line =>
                                    line.split('-').map(item => item.trim()).filter(item => item.length > 0)
                                );

                                // Nhóm các dòng theo section (1., 2., 3., ...)
                                const allSections: { header: string; items: string[] }[] = [];
                                let currentSection: { header: string; items: string[] } | null = null;

                                lines.forEach(line => {
                                    // Bỏ qua dòng có dấu ":" (specs)
                                    if (line.includes(':')) return;

                                    // Header với số thứ tự
                                    if (/^\d+\.\s/.test(line)) {
                                        if (currentSection) allSections.push(currentSection);
                                        currentSection = {
                                            header: line.replace(/^\d+\.\s/, ''),  // Bỏ số cũ
                                            items: []
                                        };
                                    } else {
                                        if (currentSection) currentSection.items.push(line);
                                    }
                                });

                                if (currentSection) allSections.push(currentSection);

                                // Bỏ section "Thông tin cơ bản"
                                const sections = allSections.filter((s, idx) =>
                                    !(idx === 0 && s.header.toLowerCase().includes('thông tin cơ bản'))
                                );

                                if (sections.length === 0) {
                                    return 'Chưa có mô tả chi tiết cho sản phẩm này.';
                                }

                                return (
                                    <div style={{ lineHeight: '1.8' }}>
                                        {sections.map((section, idx) => (
                                            <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                                                    {idx + 1}. {section.header}
                                                </div>
                                                {section.items.length > 0 && (
                                                    <ul style={{ margin: 0, paddingLeft: '40px', listStyleType: 'none' }}>
                                                        {section.items.map((item, itemIdx) => (
                                                            <li key={itemIdx} style={{ marginBottom: '0.3rem' }}>
                                                                - {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
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