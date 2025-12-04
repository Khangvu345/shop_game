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
            <p className="footer-description">
              Your ultimate destination for PlayStation consoles, handhelds, and accessories.
            </p>
          </div>

          {/* Cột 2: Explore */}
          <div className="footer-column">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li><a href="/">Trang chủ</a></li>
              <li><a href="/products">Sản phẩm</a></li>
            </ul>
          </div>

          {/* Cột 3: Support */}
          <div className="footer-column">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/shipping">Shipping & Returns</a></li>
            </ul>
          </div>
        </div>

        {/* Phần dưới: Copyright */}
        <div className="footer-bottom">
          <p>&copy; 2025 PlayStation Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;