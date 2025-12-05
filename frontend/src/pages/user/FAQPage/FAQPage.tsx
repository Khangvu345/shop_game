import React from 'react';
import './FAQPage.css';
import { AccordionItem } from '../../../components/ui/accordion/AccordionItem';

export const FAQPage: React.FC = () => {
    return (
        <div className="faq-container">
            <h1 className="faq-title">Câu hỏi thường gặp (FAQ)</h1>
            <div className="faq-list">
                <AccordionItem title="Làm thế nào để tôi đặt hàng?">
                    <p>Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán tại trang Checkout.</p>
                </AccordionItem>
                
                <AccordionItem title="Shop có hỗ trợ giao hàng toàn quốc không?">
                    <p>Có, GameShop hỗ trợ giao hàng đến tất cả các tỉnh thành trên toàn quốc thông qua các đơn vị vận chuyển uy tín.</p>
                </AccordionItem>
                
                <AccordionItem title="Chính sách đổi trả sản phẩm như thế nào?">
                    <p>Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất. Vui lòng giữ nguyên bao bì và tem mác.</p>
                </AccordionItem>
                
                <AccordionItem title="Tôi có thể thanh toán bằng những hình thức nào?">
                    <p>GameShop chấp nhận thanh toán qua thẻ tín dụng (Visa/Mastercard), chuyển khoản ngân hàng hoặc thanh toán khi nhận hàng (COD).</p>
                </AccordionItem>

                <AccordionItem title="Làm sao để kiểm tra tình trạng đơn hàng?">
                    <p>Bạn có thể vào mục "Lịch sử đơn hàng" trong trang Profile cá nhân để theo dõi trạng thái đơn hàng của mình.</p>
                </AccordionItem>
            </div>
        </div>
    );
};