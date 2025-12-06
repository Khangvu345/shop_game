import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PromotionSlider.css'; // Quan trọng: Import file CSS vừa tạo

// IMPORT ẢNH TỪ LOCAL
// Đảm bảo đường dẫn chính xác tới folder chứa ảnh của bạn
import banner1 from '../../../assets/banners/event1.png';
import banner2 from '../../../assets/banners/event2.png';
import banner3 from '../../../assets/banners/event3.png';

const slides = [
  {
    id: 1,
    image: banner1,
    title: "Mùa Hè Sôi Động",
    description: "Giảm giá 50% toàn bộ skin hiếm.",
    buttonText: "Xem Ngay",
  },
  {
    id: 2,
    image: banner2,
    title: "Sự Kiện IU Club",
    description: "Đồng hành cùng Big Game Gen 3.",
    buttonText: "Chi Tiết",
  },
  {
    id: 3,
    image: banner3,
    title: "Hàng Mới Về",
    description: "Đặt trước GTA VI ngay hôm nay.",
    buttonText: "Mua Ngay",
  },
];

const PromotionSlider = () => {
  const [curr, setCurr] = useState(0);

  const prev = () => {
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  };

  const next = () => {
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  };

  // Tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    const slideInterval = setInterval(next, 5000);
    return () => clearInterval(slideInterval);
  }, [curr]);

  return (
    <div className="slider-container">
      {/* Khung chứa các slide (Track) */}
      <div
        className="slider-track"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="slide">
            <img
              src={slide.image}
              alt={slide.title}
              className="slide-image"
            />

            {/* Nội dung chữ đè lên ảnh */}
            <div className="slide-content">
              <h3 className="slide-title">{slide.title}</h3>
              <p className="slide-desc">{slide.description}</p>
              <button className="slide-btn">{slide.buttonText}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Nút Previous */}
      <button onClick={prev} className="nav-btn prev-btn">
        <ChevronLeft size={24} />
      </button>

      {/* Nút Next */}
      <button onClick={next} className="nav-btn next-btn">
        <ChevronRight size={24} />
      </button>

      {/* Dấu chấm tròn bên dưới */}
      <div className="dots-container">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurr(i)}
            className={`dot ${curr === i ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionSlider;
