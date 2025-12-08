import React, { useEffect, useState } from 'react';
import { locationApi, type IPTITLocation } from '../../../api/ThirdParty/locationApi.ts';
import { Select } from '../../ui/input/Select.tsx';
import { Input } from '../../ui/input/Input.tsx';

interface AddressSelectorProps {
    initialCity?: string;
    initialWard?: string;
    onChange: (data: { city: string; ward: string }) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
                                                                      initialCity, initialWard, onChange
                                                                  }) => {
    // Data API
    const [provinces, setProvinces] = useState<IPTITLocation[]>([]);
    const [wards, setWards] = useState<IPTITLocation[]>([]);

    // State Selection
    const [selectedProvinceCode, setSelectedProvinceCode] = useState('');

    // Values (Tên hiển thị)
    const [cityValue, setCityValue] = useState(initialCity || '');
    const [wardValue, setWardValue] = useState(initialWard || '');

    // Mode: true = Chọn từ list, false = Nhập tay
    const [isManualMode, setIsManualMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // --- 1. INIT: Load danh sách Tỉnh (Chỉ chạy 1 lần) ---
    useEffect(() => {
        setIsLoading(true);
        locationApi.getProvinces().then(data => {
            setProvinces(data);
            setIsLoading(false);
        });
    }, []);

    // --- 2. SYNC: Đồng bộ khi cha truyền dữ liệu xuống (FIX LỖI Ở ĐÂY) ---
    useEffect(() => {
        // Chỉ xử lý khi có danh sách tỉnh và có dữ liệu city từ cha
        if (initialCity && provinces.length > 0) {
            const found = provinces.find(p => p.tenDonVi === initialCity);

            if (found) {
                // Trường hợp 1: Tìm thấy trong list -> Chọn code để load ward
                // Chỉ set nếu chưa chọn hoặc đang khác
                if (found.ma !== selectedProvinceCode) {
                    setSelectedProvinceCode(found.ma);
                    setCityValue(initialCity);
                }
            } else {
                // Trường hợp 2: Không tìm thấy (ví dụ tên tỉnh cũ) -> Chuyển nhập tay
                setCityValue(initialCity);
                setIsManualMode(true);
            }
        }
    }, [initialCity, provinces]); // Chạy lại khi initialCity hoặc list tỉnh thay đổi

    // Đồng bộ Ward khi cha truyền xuống
    useEffect(() => {
        if (initialWard) {
            setWardValue(initialWard);
        }
    }, [initialWard]);


    // --- 3. LOGIC: Load Ward khi Code Tỉnh thay đổi ---
    useEffect(() => {
        if (!selectedProvinceCode || isManualMode) return;


        setIsLoading(true);
        locationApi.getSubLocations(selectedProvinceCode).then(data => {
            setWards(data);
            setIsLoading(false);
        });
    }, [selectedProvinceCode, isManualMode]);


    // --- HANDLERS (Giữ nguyên) ---
    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const prov = provinces.find(p => p.ma === code);

        setSelectedProvinceCode(code);
        const newCity = prov ? prov.tenDonVi : '';
        setCityValue(newCity);

        // Reset ward khi đổi tỉnh
        setWardValue('');
        setWards([]);

        onChange({ city: newCity, ward: '' });
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        setWardValue(name);
        onChange({ city: cityValue, ward: name });
    };

    const handleManualChange = (field: 'city' | 'ward', value: string) => {
        if (field === 'city') setCityValue(value);
        else setWardValue(value);

        onChange({
            city: field === 'city' ? value : cityValue,
            ward: field === 'ward' ? value : wardValue
        });
    };

    const toggleMode = () => {
        setIsManualMode(!isManualMode);

    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '10px 10px',
                    background: '#fafafa',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
            >
                <span
                    onClick={toggleMode}
                    style={{
                        fontSize: '0.9rem',
                        color: '#000000ff',
                        cursor: 'pointer',
                        fontWeight: '500',
                    }}

                >
                    {isManualMode ? 'Chuyển sang chọn danh sách' : 'Không tìm thấy? Nhập tay'}
                </span>
            </div>
            {isManualMode ? (
                // MODE NHẬP TAY
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    <Input
                        label="Tỉnh / Thành phố"
                        value={cityValue}
                        onChange={e => handleManualChange('city', e.target.value)}
                        placeholder="VD: Hà Nội"
                    />
                    <Input
                        label="Quận / Huyện / Xã"
                        value={wardValue}
                        onChange={e => handleManualChange('ward', e.target.value)}
                        placeholder="VD: Cầu Giấy"
                    />
                </div>
            ) : (
                // MODE DROPDOWN
                <div style={{
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '10px',
                    }}>
                    <Select
                        label="Tỉnh / Thành phố"
                        value={selectedProvinceCode}
                        onChange={handleProvinceChange}
                        disabled={isLoading && provinces.length === 0}
                        style={{
                        width: '100%',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '15px 10px',
                        background: '#fff',
                        }}
                        options={[
                            { label: '-- Chọn Tỉnh/TP --', value: '' },
                            ...provinces.map(p => ({ label: p.tenDonVi, value: p.ma }))
                        ]}
                    />
                    <Select
                        label="Quận / Huyện / Xã"
                        value={wardValue}
                        onChange={handleWardChange}
                        disabled={!selectedProvinceCode}
                        style={{
                        width: '100%',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '15px 10px',
                        background: '#fff',
                        }}
                        options={[
                            { label: '-- Chọn Địa phương --', value: '' },
                            ...wards.map(w => ({ label: w.tenDonVi, value: w.tenDonVi }))
                        ]}
                    />
                </div>
            )}
        </div>
    );
};