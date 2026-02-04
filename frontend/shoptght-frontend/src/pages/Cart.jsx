import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { useNavigate } from 'react-router-dom'; // Dùng để chuyển trang

const Cart = () => {
    const { cartItems, totalPrice } = useContext(CartContext);
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Giỏ hàng của bạn đang trống! 🛒</h2>
                <button
                    onClick={() => navigate('/')}
                    style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
                >
                    Quay lại mua sắm
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>Giỏ Hàng ({cartItems.length} sản phẩm)</h2>

            {/* Danh sách sản phẩm */}
            <div style={{ marginTop: '20px' }}>
                {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            {/* Tổng tiền & Nút thanh toán */}
            <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                textAlign: 'right'
            }}>
                <h3>Tổng cộng: <span style={{ color: '#d32f2f' }}>{totalPrice.toLocaleString('vi-VN')} đ</span></h3>

                <button
                    onClick={() => navigate('/checkout')}
                    style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '12px 25px',
                        fontSize: '16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Tiến hành thanh toán ➡
                </button>
            </div>
        </div>
    );
};

export default Cart;