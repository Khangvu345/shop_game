import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchGoodsReceiptById, updateGoodsReceipt, resetStatus } from '../../../store/slices/InventoryBlock/goodsReceiptSlice';
import { Button } from '../../../components/ui/button/Button';
import { Card } from '../../../components/ui/card/Card';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/input/Input';
import { Spinner } from '../../../components/ui/loading/Spinner';

export function GoodsReceiptDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentReceipt, status } = useAppSelector(state => state.goodsReceipts);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ invoiceNumber: '', notes: '', updateReason: '' });

    useEffect(() => {
        if (id) dispatch(fetchGoodsReceiptById(Number(id)));
    }, [id, dispatch]);

    useEffect(() => {
        if (currentReceipt) {
            setEditForm({
                invoiceNumber: currentReceipt.invoiceNumber,
                notes: currentReceipt.notes || '',
                updateReason: ''
            });
        }
    }, [currentReceipt]);

    const handleUpdate = async () => {
        if (!editForm.updateReason) return alert('Vui lòng nhập lý do chỉnh sửa!');
        await dispatch(updateGoodsReceipt({
            id: Number(id),
            payload: editForm
        })).unwrap();
        alert('Cập nhật thành công!');
        setIsModalOpen(false);
    };

    if (!currentReceipt) return <Spinner />;

    return (
        <div style={{padding: '20px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                <h2>Chi Tiết Phiếu Nhập #{currentReceipt.receiptId}</h2>
                <div>
                    <Button onClick={() => setIsModalOpen(true)} color="1" style={{marginRight:'10px'}}>Chỉnh sửa</Button>
                    <Button onClick={() => navigate('/admin/goods-receipts')} color="0">Quay lại</Button>
                </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'20px'}}>
                <Card>
                    <h3>Thông tin chung</h3>
                    <p><strong>Nhà cung cấp:</strong> {currentReceipt.supplier?.name}</p>
                    <p><strong>Số hóa đơn:</strong> {currentReceipt.invoiceNumber}</p>
                    <p><strong>Ngày nhập:</strong> {new Date(currentReceipt.receiptDate).toLocaleString('vi-VN')}</p>
                    <p><strong>Ghi chú:</strong> {currentReceipt.notes}</p>
                </Card>
                <Card>
                    <h3>Danh sách sản phẩm</h3>
                    <table style={{width:'100%', borderCollapse:'collapse'}}>
                        <thead style={{background:'#eee'}}>
                        <tr>
                            <th style={{padding:'8px'}}>Sản phẩm</th>
                            <th>SL</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentReceipt.items?.map((line, idx) => (
                            <tr key={idx} style={{borderBottom:'1px solid #eee'}}>
                                <td style={{padding:'8px'}}>{line.productName}</td>
                                <td style={{textAlign:'center'}}>{line.quantityReceived}</td>
                                <td style={{textAlign:'right'}}>{line.unitCost.toLocaleString()}</td>
                                <td style={{textAlign:'right'}}>{line.lineTotal.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div style={{textAlign:'right', marginTop:'15px', fontSize:'1.2rem', fontWeight:'bold'}}>
                        Tổng tiền: {currentReceipt.totalCost?.toLocaleString()} VNĐ
                    </div>
                </Card>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cập nhật phiếu nhập">
                <div style={{minWidth:'400px', display:'flex', flexDirection:'column', gap:'15px'}}>
                    <div style={{background:'#fff3cd', padding:'10px', fontSize:'0.9rem'}}>
                        Lưu ý: Chỉ được sửa thông tin chung. Không được sửa danh sách sản phẩm.
                    </div>
                    <Input label="Số hóa đơn" value={editForm.invoiceNumber} onChange={e => setEditForm({...editForm, invoiceNumber:e.target.value})} />
                    <div className="form-group">
                        <label>Ghi chú</label>
                        <textarea className="form-input" rows={3} value={editForm.notes} onChange={e => setEditForm({...editForm, notes:e.target.value})} style={{width:'100%'}}/>
                    </div>
                    <Input label="Lý do chỉnh sửa (Bắt buộc)" value={editForm.updateReason} onChange={e => setEditForm({...editForm, updateReason:e.target.value})} style={{borderColor:'red'}}/>

                    <div style={{display:'flex', justifyContent:'flex-end', marginTop:'20px', gap:'10px'}}>
                        <Button onClick={() => setIsModalOpen(false)} color="0">Hủy</Button>
                        <Button onClick={handleUpdate} disabled={status === 'loading'}>Lưu thay đổi</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}