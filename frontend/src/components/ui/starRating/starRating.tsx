import './starRating.css';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'small' | 'medium' | 'large';
}

/**
 * Reusable StarRating component
 * Hiển thị đánh giá sao với các size khác nhau
 */
export function StarRating({ rating, maxRating = 5, size = 'medium' }: StarRatingProps) {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
        stars.push(
            <span key={i} className={`star ${i <= rating ? '' : 'empty'}`}>
                ★
            </span>
        );
    }
    return <div className={`stars stars--${size}`}>{stars}</div>;
}