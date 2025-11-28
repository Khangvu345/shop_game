import './ProductGallery.css';

interface ProductGalleryProps {
    images: string[];
    productName: string;
    selectedImageIndex: number;
    onSelectImage: (index: number) => void;
}

/**
 * ProductGallery component
 * Hiển thị ảnh chính và thumbnails
 */
export function ProductGallery({
    images,
    productName,
    selectedImageIndex,
    onSelectImage,
}: ProductGalleryProps) {
    return (
        <div className="product-gallery">
            <div className="main-image-container">
                <img
                    src={images[selectedImageIndex]}
                    alt={productName}
                    className="main-image"
                />
            </div>
            <div className="thumbnail-list">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`thumbnail-item ${index === selectedImageIndex ? 'active' : ''}`}
                        onClick={() => onSelectImage(index)}
                    >
                        <img src={img} alt={`${productName} - Ảnh ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}