import React, { useState } from 'react';
import './ContactPage.css';
import { Button } from '../../../components/ui/button/Button';
import { Input } from '../../../components/ui/input/Input';

export const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log('Input changed:', e.target.name, e.target.value);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);

        if (!formData.name || !formData.email || !formData.message) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const subject = encodeURIComponent(`Contact from GameShop: ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);

        // Use a hidden link to trigger mailto reliably
        const mailtoLink = `mailto:quangviet790@gmail.com?subject=${subject}&body=${body}`;
        console.log('Generated mailto link:', mailtoLink);

        const link = document.createElement('a');
        link.href = mailtoLink;
        link.click();

        // alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ mở ứng dụng email của bạn để gửi tin nhắn.');
        // setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-container">
            <div className="contact-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="contact-content">
                <div className="contact-info">
                    <div className="info-header">
                        <h3>Liên hệ với chúng tôi</h3>
                        <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7</p>
                    </div>

                    <div className="info-items">
                        <div className="info-item">
                            <div className="icon-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div className="info-text">
                                <strong>Địa chỉ</strong>
                                <span>31 LK 9 khu đô thị Văn Phú, Hà Đông, Hà Nội</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div className="info-text">
                                <strong>Email</strong>
                                <span>supportgameflow@gmail.com</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div className="info-text">
                                <strong>Hotline</strong>
                                <span>+84 986 251 666</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <div className="info-text">
                                <strong>Giờ làm việc</strong>
                                <span>8:00 - 22:00 (Hàng ngày)</span>
                            </div>
                        </div>
                    </div>

                    <div className="social-links">
                        <a href="#" className="social-link">FB</a>
                        <a href="#" className="social-link">YT</a>
                        <a href="#" className="social-link">IG</a>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h3>Gửi tin nhắn</h3>
                        <p>Để lại lời nhắn, chúng tôi sẽ phản hồi sớm nhất có thể</p>
                    </div>

                    <div className="form-group">
                        <label>Họ tên</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập họ tên của bạn"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nội dung</label>
                        <textarea
                            name="message"
                            className="contact-textarea"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Nội dung cần hỗ trợ..."
                            required
                        />
                    </div>
                    <Button type="submit" className="submit-btn">
                        Gửi liên hệ
                        <svg className="send-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </Button>
                </form>
            </div>
        </div>
    );
};
