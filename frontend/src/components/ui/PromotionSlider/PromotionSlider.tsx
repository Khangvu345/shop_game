import React from 'react';
import './PromotionSlider.css';

// IMPORT ẢNH TỪ LOCAL
import banner1 from '../../../assets/banners/event1.png';
import banner2 from '../../../assets/banners/event2.png';
import banner3 from '../../../assets/banners/event3.png';

const slides = [
  { id: 1, image: banner1, alt: "Nintendo Switch 2" },
  { id: 2, image: banner2, alt: "Sự Kiện Black Friday" },
  { id: 3, image: banner3, alt: "GTA 6 sắp ra mắt" },
];

const PromotionSlider = () => {
  // Nhân đôi danh sách slides để tạo hiệu ứng vòng lặp vô tận mượt mà
  const duplicatedSlides = [...slides, ...slides];

  return (
    <div className="slider-container">
      <div className="slider-track">
        {duplicatedSlides.map((slide, index) => (
          <div key={`${slide.id}-${index}`} className="slide">
            <img
              src={slide.image}
              alt={slide.alt}
              className="slide-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionSlider;
