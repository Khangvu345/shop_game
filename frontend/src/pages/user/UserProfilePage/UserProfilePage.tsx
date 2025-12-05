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

    if (profile.status === 'loading') return <div className="flex-center"><Spinner /></div>;

    return (
        <div className="container profile-container">
            {/* Sidebar */}
            <aside className="profile-sidebar">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profile.data?.fullName?.charAt(0) || 'U'}
                    </div>
                    <h3 className="profile-name">{profile.data?.fullName}</h3>
                    <span className="profile-tier">
                        {profile.data?.tier} Member
                    </span>
                </div>
                <div className="profile-menu">
                    <button
                        className={`menu-item ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        <UserIcon /> Thông tin cá nhân
                    </button>
                    <button
                        className={`menu-item ${activeTab === 'order' ? 'active' : ''}`}
                        onClick={() => setActiveTab('order')}
                    >
                        <CartIcon /> Lịch sử mua hàng
                    </button>
                    <button
                        className={`menu-item ${activeTab === 'address' ? 'active' : ''}`}
                        onClick={() => setActiveTab('address')}
                    >
                        <PhoneIcon /> Địa chỉ giao hàng
                    </button>
                    <button
                        className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <PasswordIcon /> Đổi mật khẩu
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="profile-content-area">
                {activeTab === 'info' && <ProfileInfoTab profile={profile.data} dispatch={dispatch} />}
                {activeTab === 'order' && <OrderHistoryPage />}
                {activeTab === 'address' && <AddressTab address={address.data} dispatch={dispatch} />}
                {activeTab === 'security' && <SecurityTab dispatch={dispatch} />}
            </main>
        </div>
    );
}

// --- SUB COMPONENTS ---

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
        <div>
            <h3 className="section-title">Thông tin cá nhân</h3>
            <form onSubmit={handleSubmit} className="info-grid">
                <Input label="Email" value={profile?.email} disabled />
                <Input label="Họ và tên" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                <Input label="Số điện thoại" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <Input label="Ngày sinh" type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} />

                <div className="stats-card">
                    <div className="stat-item">
                        <span className="stat-label">Điểm tích lũy</span>
                        <span className="stat-value">{profile?.points}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Tổng chi tiêu</span>
                        <span className="stat-value">{profile?.totalSpent?.toLocaleString()} đ</span>
                    </div>
                </div>

                <div className="form-actions">
                    <Button type="submit">Lưu thay đổi</Button>
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
        <div>
            <h3 className="section-title">Địa chỉ mặc định</h3>
            <form onSubmit={handleSubmit} className="info-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <Input label="Địa chỉ (Số nhà, đường)" value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <Input label="Địa chỉ bổ sung (Tòa nhà...)" value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} />
                </div>
                <Input label="Phường/Xã" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} />
                <Input label="Tỉnh/Thành phố" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                <Input label="Mã bưu điện" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} />

                <div className="form-actions" style={{ gridColumn: 'span 2' }}>
                    <Button type="submit">Cập nhật địa chỉ</Button>
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
        <div>
            <h3 className="section-title">Đổi mật khẩu</h3>
            <form onSubmit={handleSubmit} className="info-grid">
                <Input label="Mật khẩu hiện tại" type="password" value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} />
                <Input label="Mật khẩu mới" type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
                <Input label="Xác nhận mật khẩu mới" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />

                <div className="form-actions">
                    <Button type="submit">Đổi mật khẩu</Button>
                </div>
            </form>
        </div>
    );
}