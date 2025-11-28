import { StarRating } from '../../../ui/starRating/starRating';
import './ProductReviews.css';

// Mock data cho reviews (sẽ thay bằng API sau)
const mockReviews = [
    {
        review_id: '1',
        party_name: 'Trần Văn A',
        rating: 5,
        comment:
            'Máy PS5 Pro chạy cực mượt, đồ họa đẹp long lanh, đáng tiền từng đồng! Đặc biệt Ray Tracing + 120fps quá đỉnh!',
        created_at: '2025-11-23T10:15:00',
        replies: [
            {
                reply_id: '1',
                party_name: 'Shop Game',
                comment:
                    'Cảm ơn anh A đã tin tưởng Shop Game! Chúc anh trải nghiệm game 4K/120fps thật đã với PS5 Pro nhé!',
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
        comment:
            'Mua về chơi God of War Ragnarök quá mượt, không hề có hiện tượng giật lag. Recommend cho mọi người!',
        created_at: '2025-11-21T09:00:00',
        replies: [],
    },
];

interface ProductReviewsProps {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Array<{ star: number; count: number; percentage: number }>;
}

/**
 * ProductReviews component
 * Hiển thị đánh giá từ khách hàng
 */
export function ProductReviews({
    averageRating,
    totalReviews,
    ratingDistribution,
}: ProductReviewsProps) {
    return (
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
                                                <span className="reviewer-name">
                                                    {reply.party_name}
                                                </span>
                                                {reply.is_from_staff && (
                                                    <span className="staff-badge">Nhân viên</span>
                                                )}
                                                <span className="review-date">
                                                    {new Date(reply.created_at).toLocaleDateString(
                                                        'vi-VN'
                                                    )}
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
    );
}