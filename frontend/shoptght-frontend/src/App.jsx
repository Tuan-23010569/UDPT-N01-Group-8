import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './components/AdminLayout';
import ClientLayout from './components/ClientLayout';

import ProductList from './pages/ProductList'; // <-- TRANG ADMIN (Bảng)
import ProductForm from './pages/ProductForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';

import Collection from './pages/Collection'; // <-- TRANG KHÁCH (Lưới + Lọc) - MỚI IMPORT
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- ROUTE ADMIN (Giữ nguyên) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" />} />
          <Route path="products" element={<ProductList />} /> {/* Vẫn dùng trang cũ */}
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
        </Route>

        {/* --- ROUTE CLIENT --- */}
        <Route path="/" element={<ClientLayout />}>
           <Route index element={<Home />} />
           
           {/* Thêm route mới cho trang danh sách sản phẩm của khách */}
           <Route path="/collections" element={<Collection />} />
           <Route path="/products" element={<Collection />} /> {/* Map cả 2 link đều vào đây */}
           <Route path="/search" element={<SearchResults />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;