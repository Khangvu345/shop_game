import React, { useState } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/Auth/authSlice';
import { Button } from '../../components/ui/button/Button';
import { Input } from '../../components/ui/input/Input';
import { Card} from "../../components/ui/card/Card.tsx";

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation()
    const from = location.state?.from?.pathname || '/';

    const dispatch = useAppDispatch();

    const { status, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser(formData));

        if (loginUser.fulfilled.match(resultAction)) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <Card style={{ width: '400px', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Đăng Nhập</h2>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Tên đăng nhập"
                        name="username"
                        type="string"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Mật khẩu"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Đăng ký ngay</Link>
                </div>
                <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <Link to="/" style={{ color: '#666' }}>← Về trang chủ</Link>
                </div>


            </Card>
        </div>
    );
}