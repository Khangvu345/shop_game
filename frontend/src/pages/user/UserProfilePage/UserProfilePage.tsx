import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchMyProfile, updateMyProfile,
    fetchMyAddress, saveMyAddress,
    changeMyPassword
} from '../../../store/slices/AccountBlock/customerSlice';
import { Button } from '../../../components/ui/button/Button';
import { Input } from '../../../components/ui/input/Input';
import { Card } from '../../../components/ui/card/Card';
import { Spinner } from '../../../components/ui/loading/Spinner';
import {OrderHistoryPage} from "../OrderHistoryPage/OrderHistoryPage.tsx";

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
        <div className="container" style={{ padding: '2rem 0', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
            {/* Sidebar */}
            <Card style={{ height: 'fit-content' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: '80px', height: '80px', background: '#0EA89B', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>
                        {profile.data?.fullName?.charAt(0) || 'U'}
                    </div>
                    <h3 style={{ marginTop: '10px' }}>{profile.data?.fullName}</h3>
                    <span style={{ padding: '2px 8px', background: 'gold', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {profile.data?.tier} Member
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Button color={activeTab === 'info' ? '1' : '0'} onClick={() => setActiveTab('info')} style={{width: '100%', justifyContent:'flex-start'}}>Thông tin cá nhân</Button>
                    <Button color={activeTab === 'order' ? '1' : '0'} onClick={() => setActiveTab('order')} style={{width: '100%', justifyContent:'flex-start'}}>Lịch sử mua hàng</Button>

                    <Button color={activeTab === 'address' ? '1' : '0'} onClick={() => setActiveTab('address')} style={{width: '100%', justifyContent:'flex-start'}}>Địa chỉ giao hàng</Button>
                    <Button color={activeTab === 'security' ? '1' : '0'} onClick={() => setActiveTab('security')} style={{width: '100%', justifyContent:'flex-start'}}>Đổi mật khẩu</Button>
                </div>
            </Card>

            {/* Content */}
            <div className="profile-content">
                {activeTab === 'info' && <ProfileInfoTab profile={profile.data} dispatch={dispatch} />}
                {activeTab === 'order' && <OrderHistoryPage/>}
                {activeTab === 'address' && <AddressTab address={address.data} dispatch={dispatch} />}
                {activeTab === 'security' && <SecurityTab dispatch={dispatch} />}
            </div>
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
            if(!res.error) alert('Cập nhật thành công!');
        });
    };

    return (
        <Card>
            <h3>Thông tin cá nhân</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input label="Email" value={profile?.email} disabled />
                <Input label="Họ và tên" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                <Input label="Số điện thoại" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <Input label="Ngày sinh" type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} />

                <div style={{display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '10px', borderRadius: '8px'}}>
                    <div>Điểm tích lũy: <strong>{profile?.points}</strong></div>
                    <div>Tổng chi tiêu: <strong>{profile?.totalSpent?.toLocaleString()} đ</strong></div>
                </div>

                <Button type="submit" style={{alignSelf: 'flex-end'}}>Lưu thay đổi</Button>
            </form>
        </Card>
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
            if(!res.error) alert('Lưu địa chỉ thành công!');
        });
    };

    return (
        <Card>
            <h3>Địa chỉ mặc định</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Địa chỉ (Số nhà, đường)" value={form.line1} onChange={e => setForm({...form, line1: e.target.value})} className="col-span-2" />
                <Input label="Địa chỉ bổ sung (Tòa nhà...)" value={form.line2} onChange={e => setForm({...form, line2: e.target.value})} className="col-span-2" />
                <Input label="Phường/Xã" value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} />
                <Input label="Tỉnh/Thành phố" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                <Input label="Mã bưu điện" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />

                <div style={{gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end'}}>
                    <Button type="submit">Cập nhật địa chỉ</Button>
                </div>
            </form>
        </Card>
    );
}

function SecurityTab({ dispatch }: any) {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) return alert('Mật khẩu xác nhận không khớp');

        dispatch(changeMyPassword(form)).then((res: any) => {
            if(!res.error) {
                alert('Đổi mật khẩu thành công!');
                setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(res.payload);
            }
        });
    };

    return (
        <Card>
            <h3>Đổi mật khẩu</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input label="Mật khẩu hiện tại" type="password" value={form.oldPassword} onChange={e => setForm({...form, oldPassword: e.target.value})} />
                <Input label="Mật khẩu mới" type="password" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} />
                <Input label="Xác nhận mật khẩu mới" type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />

                <Button type="submit" style={{alignSelf: 'flex-end'}}>Đổi mật khẩu</Button>
            </form>
        </Card>
    );
}