import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, registerUser } from '../../store/slices/Auth/authSlice';
import './AuthPage.css';
import { MailIcon, PasswordIcon, UserIcon, PhoneIcon } from '../../components/ui/icon/icon';
export function AuthPage() {
    // State để toggle giữa Login và Signup (false = Login panel, true = Signup panel)

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.auth);
    const isRegisterPath = location.pathname.includes('register');
    const [isSignUp, setIsSignUp] = useState(isRegisterPath);
    // --- Logic Login ---
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };
    useEffect(() => {
// Mỗi khi location thay đổi, cập nhật lại biến isSignUp
        setIsSignUp(location.pathname.includes('register'));
    }, [location.pathname]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser(loginData));
        if (loginUser.fulfilled.match(resultAction)) {
            const userData = resultAction.payload;
            if (userData.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    };

    // --- Logic Register ---
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const resultAction = await dispatch(registerUser({
            fullName: registerData.fullName,
            email: registerData.email,
            phone: registerData.phone,
            username: registerData.username,
            password: registerData.password
        }));

        if (registerUser.fulfilled.match(resultAction)) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            // Chuyển sang panel Login sau khi đăng ký thành công
            setIsSignUp(false);
            // Reset form register nếu cần
            setRegisterData({
                fullName: '',
                email: '',
                phone: '',
                username: '',
                password: '',
                confirmPassword: ''
            });
        }
    };

    return (
        <div className="auth-container-wrapper">
            <div className={`auth-container ${isSignUp ? 'right-panel-active' : ''}`}>
                
            {/* === SIGN UP - Đăng ký === */}
            <div className="form-container sign-up-container">
                <form className="auth-form" onSubmit={handleRegisterSubmit}>
                    <h1 className="auth-title">Tạo Tài Khoản</h1>
                    {isSignUp && error && <span className="error-msg">{error}</span>}

                    {/* Họ và tên */}
                    <div className="auth-input-wrapper">
                        <UserIcon className="auth-input-icon" />
                        <input 
                            className="auth-input with-icon" 
                            type="text" 
                            placeholder="Họ và tên" 
                            name="fullName"
                            value={registerData.fullName}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="auth-input-wrapper">
                        <MailIcon className="auth-input-icon" />
                        <input 
                            className="auth-input with-icon" 
                            type="email" 
                            placeholder="Email" 
                            name="email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div className="auth-input-wrapper">
                        <PhoneIcon className="auth-input-icon" />
                        <input 
                            className="auth-input with-icon" 
                            type="text" 
                            placeholder="Số điện thoại" 
                            name="phone"
                            value={registerData.phone}
                            onChange={handleRegisterChange}
                        />
                    </div>

                    {/* Tên đăng nhập */}
                    <div className="auth-input-wrapper">
                        <UserIcon className="auth-input-icon" />
                        <input 
                            className="auth-input with-icon" 
                            type="text" 
                            placeholder="Tên đăng nhập" 
                            name="username"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="auth-input-wrapper">
                        <PasswordIcon className="auth-input-icon" />
                        <input 
                            className="auth-input with-icon" 
                            type="password" 
                            placeholder="Mật khẩu" 
                            name="password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="auth-input-wrapper">
                        <PasswordIcon className="auth-input-icon" />
                        <input 
                            className="auth-input with-icon" 
                            type="password" 
                            placeholder="Xác nhận mật khẩu" 
                            name="confirmPassword"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>
                        <button className="auth-button" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Đang xử lý...' : 'Đăng Ký'}
                        </button>
                        <button 
                            type="button" 
                            className="auth-button auth-ghost-button" 
                            style={{color: '#000000ff', border: 'none', marginTop: '10px'}}
                            onClick={() => navigate('/')}
                        >
                            Về trang chủ
                        </button>
                    </form>
                </div>

                {/* === SIGN IN - Đăng nhập === */}
                <div className="form-container sign-in-container">
                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <h1 className="auth-title">Đăng Nhập</h1>
                        {!isSignUp && error && <span className="error-msg">{error}</span>}

                        {/* Username */}
                        <div className="auth-input-wrapper">
                            <UserIcon className="auth-input-icon" />
                            <input 
                                className="auth-input with-icon" 
                                type="text" 
                                placeholder="Tên đăng nhập" 
                                name="username"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="auth-input-wrapper">
                            <PasswordIcon className="auth-input-icon" />
                            <input 
                                className="auth-input with-icon" 
                                type="password" 
                                placeholder="Mật khẩu" 
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                        <a href="#" className="auth-anchor">Quên mật khẩu?</a>
                        <button className="auth-button" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </button>
                        <button 
                            type="button" 
                            className="auth-button auth-ghost-button" 
                            style={{color: '#000000ff', border: 'none', marginTop: '10px'}}
                            onClick={() => navigate('/')}
                        >
                            Về trang chủ
                        </button>
                    </form>
                </div>

                {/* --- OVERLAY CONTAINER --- */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="auth-title">Chào mừng trở lại!</h1>
                            <p className="auth-paragraph">
                                Để giữ kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn
                            </p>
                            <button 
                                className="auth-button auth-ghost-button" 
                                onClick={() => navigate('/auth/login')} 
                            >
                                Đăng Nhập
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1 className="auth-title">Xin chào, Bạn!</h1>
                            <p className="auth-paragraph">
                                Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi
                            </p>
                            <button 
                                className="auth-button auth-ghost-button" 
                                onClick={() => navigate('/auth/register')}
                            >
                                Đăng Ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}