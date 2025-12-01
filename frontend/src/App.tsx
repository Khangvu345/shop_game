import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router/AppRoutes';

import './assets/styles/global.css';
import {useAppDispatch} from "./store/hooks.ts";
import {useEffect, useState} from "react";
import {checkAuth} from "./store/slices/Auth/authSlice.ts";
import {Spinner} from "./components/ui/loading/Spinner.tsx";

function App() {
    const dispatch = useAppDispatch();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        // Hàm khởi tạo
        const initApp = async () => {
            // Gọi thunk checkAuth và đợi nó chạy xong
            await dispatch(checkAuth());

            // Chạy xong (dù thành công hay thất bại) thì tắt màn hình chờ
            setIsInitializing(false);
        };

        initApp();
    }, [dispatch]);


    if (isInitializing) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner />
            </div>
        );
    }
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}
export default App;