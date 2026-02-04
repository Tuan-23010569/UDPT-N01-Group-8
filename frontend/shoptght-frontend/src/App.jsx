import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Bỏ import BrowserRouter
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './components/AdminLayout';
import ClientLayout from './components/ClientLayout';

import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';

import Collection from './pages/Collection';
import SearchResults from './pages/SearchResults';

// --- IMPORT MỚI CHO GIỎ HÀNG & THANH TOÁN ---
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- ROUTE ADMIN (Giữ nguyên) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
        </Route>

        {/* --- ROUTE CLIENT --- */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />

          <Route path="/collections" element={<Collection />} />
          <Route path="/products" element={<Collection />} />
          <Route path="/search" element={<SearchResults />} />

          {/* --- THÊM ROUTE MỚI --- */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;