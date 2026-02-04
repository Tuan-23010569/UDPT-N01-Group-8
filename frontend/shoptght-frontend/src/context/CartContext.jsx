import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Lấy dữ liệu từ LocalStorage nếu có, không thì là mảng rỗng
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Tự động lưu vào LocalStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // 1. Thêm sản phẩm vào giỏ
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Kiểm tra xem sản phẩm đã có trong giỏ chưa
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                // Nếu có rồi -> Tăng số lượng
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Nếu chưa có -> Thêm mới với số lượng 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        alert("Đã thêm vào giỏ hàng!");
    };

    // 2. Xóa sản phẩm
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    // 3. Cập nhật số lượng (+/-)
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return; // Không cho giảm dưới 1
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // 4. Xóa sạch giỏ (sau khi thanh toán xong)
    const clearCart = () => {
        setCartItems([]);
    };

    // 5. Tính tổng tiền
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};