import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Context ---
import { CartProvider } from './context/CartContext';

// --- Layouts ---
import AdminLayout from './components/AdminLayout';
import ClientLayout from './components/ClientLayout';

// --- Pages (Admin) ---
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';

// --- Pages (Auth) ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Pages (Client) ---
import Home from './pages/Home';
import Collection from './pages/Collection';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import PaymentPage from './pages/PaymentPage';
import OrderManager from './pages/OrderManager';

function App() {
  return (
    // 1. CartProvider bọc ngoài cùng để State giỏ hàng tồn tại toàn app
    <CartProvider>
      <BrowserRouter>
        {/* 2. ToastContainer để hiển thị thông báo (z-index cao nhất) */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* --- ROUTE AUTH --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- ROUTE ADMIN --- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/products" />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<OrderManager />} />
          </Route>

          {/* --- ROUTE CLIENT --- */}
          <Route path="/" element={<ClientLayout />}>
             <Route index element={<Home />} />
             
             {/* Trang danh sách sản phẩm & lọc */}
             <Route path="/collections" element={<Collection />} />
             <Route path="/products" element={<Collection />} />
             
             {/* Trang tìm kiếm */}
             <Route path="/search" element={<SearchResults />} />
             
             {/* Trang thanh toán & kết quả */}
             <Route path="/checkout" element={<Checkout />} />
             <Route path="/order-success/:id" element={<OrderSuccess />} />
             <Route path="/payment/:orderId" element={<PaymentPage />} />
             
             {/* Lưu ý: Nếu bạn click vào sản phẩm sẽ ra link /product/:id 
                 Hiện tại chưa có trang Chi tiết sản phẩm (ProductDetail), 
                 bạn có thể thêm sau nhé.
             */}
          </Route>

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;