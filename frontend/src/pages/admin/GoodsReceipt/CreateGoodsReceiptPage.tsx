import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
// Import actions
import { fetchSuppliers } from '../../../store/slices/ProductBlock/supplierSilce';
import { fetchProducts } from '../../../store/slices/ProductBlock/productSlice';
import { createGoodsReceipt, resetStatus } from '../../../store/slices/InventoryBlock/goodsReceiptSlice';
// Components
import { Button } from '../../../components/ui/button/Button';
import { Input } from '../../../components/ui/input/Input';
import { Select } from '../../../components/ui/input/Select';
import { Card } from '../../../components/ui/card/Card';
import { Spinner } from '../../../components/ui/loading/Spinner';
import type { ICreateGoodsReceiptItem } from '../../../types';

export function CreateGoodsReceiptPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { data: suppliers } = useAppSelector(state => state.suppliers);
    const { data: products } = useAppSelector(state => state.products);
    const { status, error } = useAppSelector(state => state.goodsReceipts);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [supplierId, setSupplierId] = useState<number | ''>('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [notes, setNotes] = useState('');

    // Items List
    const [items, setItems] = useState<ICreateGoodsReceiptItem[]>([]);

    // Temp Item Input
    const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [unitCost, setUnitCost] = useState<number>(NaN);

    useEffect(() => {
        dispatch(fetchSuppliers({}));
        dispatch(fetchProducts({size:999}));
        dispatch(resetStatus());
    }, [dispatch]);

    useEffect(() => {
        if (status === 'succeeded' && isSubmitting) {
            alert('Nhập hàng thành công!');
            dispatch(resetStatus());
            navigate('/admin/goods-receipts');
        }
        if (status === 'failed') setIsSubmitting(false);
    }, [status, isSubmitting, navigate, dispatch]);

    const handleAddItem = () => {
        if (!selectedProductId || quantity <= 0 || unitCost <= 0) {
            alert('Vui lòng nhập thông tin sản phẩm hợp lệ');
            return;
        }

        const newItem = {
            productId: Number(selectedProductId),
            quantity: Number(quantity),
            unitCost: Number(unitCost)
        };

        // Logic cộng dồn nếu trùng sản phẩm
        const existingIdx = items.findIndex(i => i.productId === newItem.productId);
        if (existingIdx >= 0) {
            const newItems = [...items];
            newItems[existingIdx].quantity += newItem.quantity;
            newItems[existingIdx].unitCost = newItem.unitCost;
            setItems(newItems);
        } else {
            setItems([...items, newItem]);
        }

        // Reset input
        setSelectedProductId(''); setQuantity(1); setUnitCost(0);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!supplierId || !invoiceNumber || items.length === 0) {
            alert('Thiếu thông tin bắt buộc!');
            return;
        }
        setIsSubmitting(true);
        dispatch(createGoodsReceipt({
            supplierId: Number(supplierId),
            invoiceNumber,
            notes,
            items
        }));
    };

    return (
        <div className="container" style={{ padding: '20px 0' }}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                <h2>Tạo Phiếu Nhập Hàng</h2>
                <Button onClick={() => navigate('/admin/goods-receipts')} color="0">Quay lại</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* INFO CARD */}
                <Card>
                    <h3>Thông tin chung</h3>
                    <Select
                        label="Nhà cung cấp"
                        required
                        value={supplierId}
                        onChange={e => setSupplierId(Number(e.target.value))}
                        options={[{ label: '-- Chọn sản nhà cung cấp --', value: ''},
                            ...(suppliers?.map(s => ({ label: s.name, value: s.supplierId }))) || []]}
                    />
                    <Input
                        label="Số hóa đơn"
                        required
                        value={invoiceNumber}
                        onChange={e => setInvoiceNumber(e.target.value)}
                    />
                    <div className="form-group" style={{marginTop:'10px'}}>
                        <label>Ghi chú</label>
                        <textarea className="form-input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} style={{width:'100%'}}/>
                    </div>
                </Card>

                {/* ITEMS CARD */}
                <Card>
                    <h3>Chi tiết hàng hóa</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'end', marginBottom: '15px', background:'#f9f9f9', padding:'10px', borderRadius:'8px' }}>
                        <Select
                            label="Sản phẩm"
                            value={selectedProductId}
                            onChange={e => setSelectedProductId(Number(e.target.value))}
                            options={[
                                { label: '-- Chọn sản phẩm để nhập --', value: '' },
                                ...(products?.map(p => ({
                                    label: `${p.sku} - ${p.productName}`,
                                    value: p.productId
                                })) || [])
                            ]}
                            style={{ flex: 2 }}
                        />
                        <Input label="SL" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ flex: 1 }} />
                        <Input label="Giá nhập" type="number" value={unitCost} onChange={e => setUnitCost(Number(e.target.value))} style={{ flex: 1 }} />
                        <Button onClick={handleAddItem}>+ Thêm</Button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize:'0.9rem' }}>
                        <thead style={{background:'#eee'}}>
                        <tr>
                            <th style={{padding:'8px'}}>Sản phẩm</th>
                            <th>SL</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item, idx) => {
                            const p = products?.find(x => x.productId === item.productId);
                            return (
                                <tr key={idx} style={{borderBottom:'1px solid #eee'}}>
                                    <td style={{padding:'8px'}}>{p?.productName}</td>
                                    <td style={{textAlign:'center'}}>{item.quantity}</td>
                                    <td style={{textAlign:'right'}}>{item.unitCost.toLocaleString()}</td>
                                    <td style={{textAlign:'right'}}>{(item.quantity * item.unitCost).toLocaleString()}</td>
                                    <td style={{textAlign:'center'}}>
                                        <span onClick={() => handleRemoveItem(idx)} style={{color:'red', cursor:'pointer'}}>✕</span>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={3} style={{textAlign:'right', fontWeight:'bold', padding:'10px'}}>Tổng cộng:</td>
                            <td style={{textAlign:'right', fontWeight:'bold', fontSize:'1.1rem', color:'var(--color-secondary-0)'}}>
                                {items.reduce((s, i) => s + i.quantity * i.unitCost, 0).toLocaleString()} VNĐ
                            </td>
                            <td></td>
                        </tr>
                        </tfoot>
                    </table>

                    {error && <p style={{color:'red', marginTop:'10px'}}>{error}</p>}

                    <Button onClick={handleSubmit} disabled={status === 'loading'} style={{width:'100%', marginTop:'20px'}}>
                        {status === 'loading' ? <Spinner /> : 'HOÀN TẤT NHẬP KHO'}
                    </Button>
                </Card>
            </div>
        </div>
    );
}