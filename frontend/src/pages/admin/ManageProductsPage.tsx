import {AdminTable} from "../../components/features/AdminTable/AdminTable.tsx";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import { fetchProducts, deleteProduct} from "../../store/slices/productSlice.ts";

export function ManageProductsPage(){
    const dispatch = useAppDispatch();
    const { data: products, status } = useAppSelector((state) => state.products);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchProducts());
    }, [status, dispatch]);




    return (
        <div>

            <AdminTable
                data={products || []}
                isLoading={status === 'loading'}
                onEdit={(item) => alert(`Chức năng sửa sản phẩm ${item.productId} đang được phát triển.`)}
                onDelete={(item) => dispatch(deleteProduct(item.productId))}
            />
        </div>
    );
}