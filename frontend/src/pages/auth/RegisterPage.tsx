import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../store/slices/Auth/authSlice';
import { Button } from '../../components/ui/button/Button';
import { Input } from '../../components/ui/input/Input';
import { Card } from "../../components/ui/card/Card.tsx";

export function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        // Gọi API Register
        const resultAction = await dispatch(registerUser({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            username: formData.username,
            password: formData.password
        }));

        if (registerUser.fulfilled.match(resultAction)) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/auth/login');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px' }}>
            <Card style={{ width: '450px', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Đăng Ký Tài Khoản</h2>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Input
                        label="Họ và tên"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <Input
                        label="Tên đăng nhập"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                        <Input
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Xác nhận MK"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Đang xử lý...' : 'Đăng Ký'}
                    </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Đã có tài khoản? <Link to="/auth/login" style={{ color: 'var(--color-secondary-0)', fontWeight: 'bold' }}>Đăng nhập ngay</Link>
                </div>
                <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <Link to="/" style={{ color: '#666' }}>← Về trang chủ</Link>
                </div>
            </Card>
        </div>
    );
}