import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import orderApi from '../api/orderApi';

const Checkout = () => {
    const { cartItems, totalPrice, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        if (cartItems.length === 0) {
            // alert("Giỏ hàng đang trống!"); // Có thể bỏ comment nếu muốn hiện thông báo
            navigate('/');
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderItems = cartItems.map(item => ({
                productCode: item.id.toString(),
                productName: item.name,
                price: item.price,
                quantity: item.quantity
            }));

            const payload = {
                customerName: formData.name,
                customerEmail: formData.email,
                items: orderItems
            };

            const response = await orderApi.placeOrder(payload);
            const orderId = response.data || response;

            alert(`🎉 Đặt hàng thành công! Mã đơn: ${orderId}`);
            clearCart();

            // Mở hóa đơn PDF
            if (orderId) {
                const pdfUrl = orderApi.getInvoiceUrl(orderId);
                window.open(pdfUrl, '_blank');
            }

            navigate('/');

        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            alert("❌ Có lỗi xảy ra. Vui lòng kiểm tra lại server!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', display: 'flex', gap: '40px' }}>
            <div style={{ flex: 1 }}>
                <h2>Thông tin giao hàng</h2>
                <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label>Họ và tên</label>
                        <input
                            type="text" name="name" required
                            value={formData.name} onChange={handleInputChange}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email" name="email" required
                            value={formData.email} onChange={handleInputChange}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            placeholder="email@example.com"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: 'black', color: 'white',
                            padding: '15px', border: 'none', cursor: 'pointer',
                            fontSize: '16px', marginTop: '10px', opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Đang xử lý...' : `Thanh toán ${totalPrice?.toLocaleString('vi-VN')} đ`}
                    </button>
                </form>
            </div>

            <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                <h3>Đơn hàng của bạn</h3>
                <hr />
                {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                        <span>{item.name} (x{item.quantity})</span>
                        <b>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</b>
                    </div>
                ))}
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginTop: '10px' }}>
                    <strong>Tổng cộng:</strong>
                    <strong style={{ color: '#d32f2f' }}>{totalPrice?.toLocaleString('vi-VN')} đ</strong>
                </div>
            </div>
        </div>
    );
};

export default Checkout;