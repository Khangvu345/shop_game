import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Phần trên: Grid 3 cột */}
        <div className="footer-top">
          
          {/* Cột 1: Giới thiệu (Logo hoặc Slogan) */}
          <div className="footer-column brand-column">
            {/* Bạn có thể thêm Logo ở đây nếu muốn */}
            {/* <h2 className="footer-logo">GameShop</h2> */}
            <img
            src="/assets/images/logo2.png"
            alt="Game Flow Store Logo"
            className="footer-logo"
            width={60}      // tuỳ chỉnh kích thước bạn muốn
            height={60}
            ></img>
            <p className="footer-description">
              Điểm đến hàng đầu của bạn cho các bảng điều khiển PlayStation, thiết bị cầm tay và phụ kiện.
            </p>
          </div>

          {/* Cột 2: Explore */}
          <div className="footer-column">
            <h3 className="footer-heading">Khám phá</h3>
            <ul className="footer-links">
              <li><a href="/">Trang chủ</a></li>
              <li><a href="/products">Sản phẩm</a></li>
            </ul>
          </div>

          {/* Cột 3: Support */}
          <div className="footer-column">
            <h3 className="footer-heading">Hỗ trợ</h3>
            <ul className="footer-links">
              <li><a href="/contact">Liên hệ</a></li>
              <li><a href="/faq">Câu hỏi thường gặp</a></li>
              <li><a href="/shipping">Vận chuyển & Trả hàng</a></li>
            </ul>
          </div>
        </div>

        {/* Phần dưới: Copyright */}
        <div className="footer-bottom">
          <p>&copy; 2025 Game Flow Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;