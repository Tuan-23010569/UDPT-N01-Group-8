import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const CartItem = ({ item }) => {
    const { removeFromCart, updateQuantity } = useContext(CartContext);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            padding: '15px 0'
        }}>
            {/* Hình ảnh (Giả sử bạn có field imageUrl, nếu không có thì dùng ảnh demo) */}
            <img
                src={item.imageUrl || "https://placehold.co/100"}
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '20px' }}
            />

            {/* Thông tin */}
            <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                <p style={{ margin: 0, color: '#888' }}>
                    {item.price.toLocaleString('vi-VN')} đ
                </p>
            </div>

            {/* Bộ chỉnh số lượng */}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ padding: '5px 10px', cursor: 'pointer' }}
                >-</button>

                <span style={{ margin: '0 10px', fontWeight: 'bold' }}>{item.quantity}</span>

                <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ padding: '5px 10px', cursor: 'pointer' }}
                >+</button>
            </div>

            {/* Nút Xóa */}
            <button
                onClick={() => removeFromCart(item.id)}
                style={{
                    color: 'red',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Xóa
            </button>
        </div>
    );
};

export default CartItem;