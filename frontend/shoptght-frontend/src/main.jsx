import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // Import Router (để dùng Link)
import { CartProvider } from './context/CartContext' // Import CartProvider (để dùng Giỏ hàng)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👇 Bọc CartProvider ở ngoài cùng để toàn bộ App dùng được dữ liệu giỏ hàng */}
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)