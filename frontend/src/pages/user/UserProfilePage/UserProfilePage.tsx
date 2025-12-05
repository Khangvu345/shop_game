import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchMyProfile, updateMyProfile,
    fetchMyAddress, saveMyAddress,
    changeMyPassword
} from '../../../store/slices/AccountBlock/customerSlice';
import { Button } from '../../../components/ui/button/Button';
import { Input } from '../../../components/ui/input/Input';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { OrderHistoryPage } from "../OrderHistoryPage/OrderHistoryPage.tsx";
import { UserIcon, CartIcon, PhoneIcon, PasswordIcon } from '../../../components/ui/icon/icon';
import './UserProfilePage.css';

export function UserProfilePage() {
    const dispatch = useAppDispatch();
    const { profile, address } = useAppSelector(state => state.customer);
    const [activeTab, setActiveTab] = useState<'info' | 'address' | 'security' | 'order'>('info');

    useEffect(() => {
        dispatch(fetchMyProfile());
        dispatch(fetchMyAddress());
    }, [dispatch]);

    if (profile.status === 'loading') return <div className="flex-center page-loading"><Spinner /></div>;

    return (
        <div className="container profile-page-wrapper">
            <div className="profile-layout">
                {/* Sidebar */}
                <aside className="profile-sidebar">
                    <div className="sidebar-cover"></div>
                    <div className="profile-card-content">
                        <div className="profile-avatar">
                            {profile.data?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <h3 className="profile-name">{profile.data?.fullName}</h3>
                        <div className="profile-badges">
                            <span className={`badge tier-${profile.data?.tier?.toLowerCase()}`}>
                                {profile.data?.tier || 'Member'}
                            </span>
                        </div>
                        
                        <div className="profile-stats-mini">
                            <div className="mini-stat">
                                <strong>{profile.data?.points || 0}</strong>
                                <span>Điểm</span>
                            </div>
                            <div className="mini-stat">
                                <strong>{profile.data?.totalOrders || 0}</strong>
                                <span>Đơn hàng</span>
                            </div>
                        </div>
                    </div>

                    <nav className="profile-menu">
                        <button
                            className={`menu-item ${activeTab === 'info' ? 'active' : ''}`}
                            onClick={() => setActiveTab('info')}
                        >
                            <span className="icon"><UserIcon /></span>
                            <span>Thông tin cá nhân</span>
                        </button>
                        <button
                            className={`menu-item ${activeTab === 'order' ? 'active' : ''}`}
                            onClick={() => setActiveTab('order')}
                        >
                            <span className="icon"><CartIcon /></span>
                            <span>Lịch sử mua hàng</span>
                        </button>
                        <button
                            className={`menu-item ${activeTab === 'address' ? 'active' : ''}`}
                            onClick={() => setActiveTab('address')}
                        >
                            <span className="icon"><PhoneIcon /></span>
                            <span>Địa chỉ giao hàng</span>
                        </button>
                        <button
                            className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <span className="icon"><PasswordIcon /></span>
                            <span>Đổi mật khẩu</span>
                        </button>
                    </nav>
                </aside>

                {/* Content */}
                <main className="profile-content-area fade-in">
                    {activeTab === 'info' && <ProfileInfoTab profile={profile.data} dispatch={dispatch} />}
                    {activeTab === 'order' && <OrderHistoryPage />}
                    {activeTab === 'address' && <AddressTab address={address.data} dispatch={dispatch} />}
                    {activeTab === 'security' && <SecurityTab dispatch={dispatch} />}
                </main>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS (Giữ nguyên logic, chỉ sửa class/layout) ---

function ProfileInfoTab({ profile, dispatch }: any) {
    const [form, setForm] = useState({ fullName: '', phone: '', birthDate: '' });

    useEffect(() => {
        if (profile) {
            setForm({
                fullName: profile.fullName || '',
                phone: profile.phone || '',
                birthDate: profile.birthDate || ''
            });
        }
    }, [profile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateMyProfile(form)).then((res: any) => {
            if (!res.error) alert('Cập nhật thành công!');
        });
    };

    return (
        <div className="tab-content">
            <h2 className="tab-title">Thông tin tài khoản</h2>
            
            {/* Stats Cards Row */}
            <div className="stats-row">
                <div className="stat-card blue-gradient">
                    <div className="stat-info">
                        <span className="stat-label">Tổng chi tiêu</span>
                        <span className="stat-number">{profile?.totalSpent?.toLocaleString()} đ</span>
                    </div>
                    <div className="stat-icon-bg">💰</div>
                </div>
                <div className="stat-card purple-gradient">
                    <div className="stat-info">
                        <span className="stat-label">Điểm tích lũy</span>
                        <span className="stat-number">{profile?.points} P</span>
                    </div>
                    <div className="stat-icon-bg">⭐</div>
                </div>
                <div className="stat-card green-gradient">
                    <div className="stat-info">
                        <span className="stat-label">Hạng thành viên</span>
                        <span className="stat-number">{profile?.tier}</span>
                    </div>
                    <div className="stat-icon-bg">👑</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-grid">
                    <Input label="Email đăng nhập" value={profile?.email} disabled className="readonly-input" />
                    <Input label="Họ và tên" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                    <Input label="Số điện thoại" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <Input label="Ngày sinh" type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} />
                </div>

                <div className="form-footer">
                    <Button type="submit" size="medium" color="1">Lưu thay đổi</Button>
                </div>
            </form>
        </div>
    );
}

function AddressTab({ address, dispatch }: any) {
    const [form, setForm] = useState({ line1: '', line2: '', ward: '', city: '', postalCode: '' });

    useEffect(() => {
        if (address) {
            setForm({
                line1: address.line1 || '',
                line2: address.line2 || '',
                ward: address.ward || '',
                city: address.city || '',
                postalCode: address.postalCode || ''
            });
        }
    }, [address]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(saveMyAddress(form)).then((res: any) => {
            if (!res.error) alert('Lưu địa chỉ thành công!');
        });
    };

    return (
        <div className="tab-content">
            <h2 className="tab-title">Địa chỉ giao hàng mặc định</h2>
            <p className="tab-subtitle">Địa chỉ này sẽ được sử dụng làm mặc định khi bạn thanh toán.</p>

            <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-grid">
                    <div className="full-width">
                        <Input label="Địa chỉ (Số nhà, tên đường)" value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} />
                    </div>
                    <div className="full-width">
                        <Input label="Địa chỉ bổ sung (Tòa nhà, số tầng...)" value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} />
                    </div>
                    <Input label="Phường/Xã" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} />
                    <Input label="Tỉnh/Thành phố" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                    <Input label="Mã bưu điện (Zip Code)" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} />
                </div>

                <div className="form-footer">
                    <Button type="submit" size="medium" color="1">Cập nhật địa chỉ</Button>
                </div>
            </form>
        </div>
    );
}

function SecurityTab({ dispatch }: any) {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) return alert('Mật khẩu xác nhận không khớp');

        dispatch(changeMyPassword(form)).then((res: any) => {
            if (!res.error) {
                alert('Đổi mật khẩu thành công!');
                setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(res.payload);
            }
        });
    };

    return (
        <div className="tab-content">
            <h2 className="tab-title">Bảo mật tài khoản</h2>
            <p className="tab-subtitle">Thay đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn.</p>

            <form onSubmit={handleSubmit} className="modern-form security-form">
                <div className="form-single-col">
                    <Input label="Mật khẩu hiện tại" type="password" value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} />
                    <Input label="Mật khẩu mới" type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
                    <Input label="Xác nhận mật khẩu mới" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>

                <div className="form-footer">
                    <Button type="submit" size="medium" color="1">Đổi mật khẩu</Button>
                </div>
            </form>
        </div>
    );
}