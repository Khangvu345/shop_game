import React from 'react';
import './FAQPage.css';
import { AccordionItem } from '../../../components/ui/accordion/AccordionItem';

export const FAQPage: React.FC = () => {
    return (
        <div className="faq-page">
            <div className="faq-header">
                <div className="faq-header-content">
                    <h1 className="faq-title">Câu hỏi thường gặp</h1>
                    <p className="faq-subtitle">Chúng tôi có thể giúp gì cho bạn?</p>
                </div>
                <div className="faq-header-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
            </div>

            <div className="faq-container">
                <div className="faq-list">
                    <AccordionItem title="Làm thế nào để tôi đặt hàng?">
                        <p>
                            Bạn có thể đặt hàng trực tiếp trên website một cách rất đơn giản.
                            Chỉ cần chọn sản phẩm bạn yêu thích, bấm vào nút “Thêm vào giỏ hàng”,
                            sau đó truy cập trang Giỏ hàng để kiểm tra lại thông tin. Khi đã sẵn sàng,
                            bạn tiếp tục đến trang Checkout để nhập địa chỉ nhận hàng, lựa chọn phương thức thanh toán
                            và xác nhận đơn hàng. Sau khi hoàn tất, hệ thống sẽ gửi email xác nhận cho bạn trong vài phút.
                            Mọi thao tác đều được thiết kế rõ ràng và dễ hiểu, nên bạn chỉ mất chưa đến 1 phút để hoàn thành!
                        </p>
                    </AccordionItem>

                    <AccordionItem title="Shop có hỗ trợ giao hàng toàn quốc không?">
                        <p>
                            Tất nhiên rồi! GameShop hỗ trợ giao hàng đến toàn bộ 63 tỉnh thành trên cả nước.
                            Chúng tôi hợp tác với các đơn vị vận chuyển uy tín để đảm bảo đơn hàng được giao nhanh,
                            an toàn và đúng dự kiến. Dù bạn ở trung tâm thành phố hay vùng xa, đơn hàng vẫn sẽ được xử lý
                            và gửi đi sớm nhất có thể. Ngoài ra, bạn sẽ nhận được mã vận đơn sau khi hàng được gửi đi
                            để tiện theo dõi hành trình.
                        </p>
                    </AccordionItem>

                    <AccordionItem title="Chính sách đổi trả sản phẩm như thế nào?">
                        <p>
                            Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày bạn nhận được sản phẩm
                            nếu phát sinh lỗi từ nhà sản xuất. Bạn chỉ cần giữ lại hộp, bao bì, tem mác
                            và đảm bảo sản phẩm chưa bị can thiệp hoặc hư hại bởi tác động bên ngoài.
                            Sau khi tiếp nhận yêu cầu, đội ngũ hỗ trợ sẽ liên hệ để hướng dẫn bạn quy trình đổi trả
                            một cách chi tiết nhất. Chúng tôi luôn ưu tiên sự hài lòng của khách hàng,
                            nên mọi khâu đều được xử lý nhanh chóng và thân thiện.
                        </p>
                    </AccordionItem>

                    <AccordionItem title="Tôi có thể thanh toán bằng những hình thức nào?">
                        <p>
                            GameShop cung cấp nhiều phương thức thanh toán linh hoạt để bạn lựa chọn.
                            Bạn có thể thanh toán bằng thẻ tín dụng (Visa/Mastercard), chuyển khoản ngân hàng,
                            hoặc lựa chọn hình thức COD – thanh toán khi nhận hàng. Tất cả đều đảm bảo an toàn,
                            nhanh chóng và thuận tiện. Với hình thức online, giao dịch của bạn được mã hóa bảo mật;
                            còn với COD, bạn chỉ cần nhận hàng rồi thanh toán trực tiếp cho shipper.
                            Chúng tôi luôn muốn mang lại trải nghiệm thoải mái nhất cho bạn.
                        </p>
                    </AccordionItem>

                    <AccordionItem title="Làm sao để kiểm tra tình trạng đơn hàng?">
                        <p>
                            Để kiểm tra tình trạng đơn hàng, bạn chỉ cần đăng nhập vào tài khoản,
                            truy cập mục “Lịch sử đơn hàng” trong trang Profile cá nhân. Tại đây,
                            bạn sẽ thấy toàn bộ thông tin từ thời điểm đặt hàng, đang xử lý, đã gửi đi,
                            cho đến khi giao thành công. Ngoài ra, nếu bạn có mã vận đơn,
                            bạn cũng có thể theo dõi trực tiếp hành trình vận chuyển trên website của đơn vị giao hàng.
                            Mọi thứ đều rõ ràng, dễ theo dõi và được cập nhật liên tục.
                        </p>
                    </AccordionItem>

                </div>

                <div className="faq-contact-prompt">
                    <h3>Bạn vẫn còn thắc mắc?</h3>
                    <p>Nếu bạn không tìm thấy câu trả lời mình cần, hãy liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
                    <a href="/contact" className="btn-contact">Liên hệ ngay</a>
                </div>
            </div>
        </div>
    );
};