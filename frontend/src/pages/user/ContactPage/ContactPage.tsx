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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-container">
            <h1 className="contact-title">Liên hệ với chúng tôi</h1>
            <div className="contact-content">
                <div className="contact-info">
                    <h3>Thông tin liên hệ</h3>
                    <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP.HCM</p>
                    <p><strong>Email:</strong> support@gameshop.com</p>
                    <p><strong>Hotline:</strong> 1900 1234</p>
                    <p><strong>Giờ làm việc:</strong> 8:00 - 22:00 (Hàng ngày)</p>
                </div>
                
                <form className="contact-form" onSubmit={handleSubmit}>
                    <h3>Gửi tin nhắn</h3>
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
                    <Button type="submit">Gửi liên hệ</Button>
                </form>
            </div>
        </div>
    );
};
