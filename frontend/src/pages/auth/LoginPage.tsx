import React, { useState } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/Auth/authSlice';
import { Button } from '../../components/ui/button/Button';
import { Input } from '../../components/ui/input/Input';
import { Card} from "../../components/ui/card/Card.tsx";

import "./LoginPage.css";

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
            const userData = resultAction.payload;

            if (userData.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    };

    return (
        <div className="login-page-container">
            <Card className="login-card">
                <h2 className="login-heading">Đăng Nhập</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <Input
                        placeholder="Tên đăng nhập"
                        name="username"
                        type="string"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="custom-input-style"
                    />
                    <Input
                        placeholder="Mật khẩu"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="custom-input-style"
                    />

                    <Button
                        type="submit"
                        className="login-button"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                </form>

                <div className="login-link-group">
                    Chưa có tài khoản? <Link to="/auth/register" className="primary-link">Đăng ký ngay</Link>
                </div>
                <div className="login-link-group back-home">
                    <Link to="/" className="secondary-link">← Về trang chủ</Link>
                </div>


            </Card>
        </div>
    );
}