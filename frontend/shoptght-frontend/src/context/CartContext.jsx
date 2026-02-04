import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. Lấy dữ liệu từ LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Lưu vào LocalStorage khi cart thay đổi
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- HÀM THÊM VÀO GIỎ (ĐÃ SỬA LỖI) ---
  const addToCart = (product, variant, quantity = 1) => {
    if (!variant) {
        toast.error("Sản phẩm này tạm hết hàng!");
        return;
    }

    // A. XỬ LÝ SIDE EFFECT (Thông báo) TRƯỚC HOẶC SAU KHI SET STATE
    // Chúng ta kiểm tra nhanh trên cartItems hiện tại để hiện thông báo
    const isExist = cartItems.some(
        item => item.id === product.id && item.color === variant.color && item.size === variant.size
    );

    if (isExist) {
        toast.success(`Đã tăng số lượng: ${product.name}`);
    } else {
        toast.success("Đã thêm vào giỏ hàng!");
    }

    // B. CẬP NHẬT STATE (Phải là hàm thuần túy, không gọi toast trong này)
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.color === variant.color && item.size === variant.size
      );

      if (existingItemIndex > -1) {
        // Tăng số lượng
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Thêm mới
        const newItem = {
            id: product.id,
            name: product.name,
            price: variant.price,
            image: variant.imageUrl,
            color: variant.color,
            size: variant.size,
            quantity: quantity
        };
        return [...prevItems, newItem];
      }
    });
  };

  // --- HÀM XÓA KHỎI GIỎ ---
  const removeFromCart = (productId, color, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.color === color && item.size === size)));
    toast.info("Đã xóa sản phẩm khỏi giỏ");
  };

  // --- TÍNH TỔNG SỐ LƯỢNG ---
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};