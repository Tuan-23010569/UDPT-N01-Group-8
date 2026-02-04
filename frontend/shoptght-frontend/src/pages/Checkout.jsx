import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { toast } from 'react-toastify';
import { MapPin, Phone, User, Mail, CreditCard, ArrowLeft } from 'lucide-react';

// 1. IMPORT HOOK LẤY GIỎ HÀNG THẬT
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 2. LẤY DỮ LIỆU TỪ CONTEXT
  const { cartItems } = useCart();

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // State thông tin khách hàng
  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    note: ''
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // Xử lý Đặt hàng
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
        toast.warning("Giỏ hàng đang trống!");
        return;
    }

    setLoading(true);

    // Chuẩn bị payload gửi lên Order Service
    const orderPayload = {
      customerName: customer.fullName,
      customerEmail: customer.email,
      phone: customer.phone,
      address: customer.address,
      note: customer.note,
      totalAmount: totalPrice,
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size
      }))
    };

    try {
      const response = await orderApi.placeOrder(orderPayload);
      // Lấy Order ID từ phản hồi
      const orderId = response.data?.id || response.data || response; 
      
      toast.success("Đặt hàng thành công! Vui lòng thanh toán.");
      
      // Xóa dữ liệu giỏ hàng trong LocalStorage
      localStorage.removeItem('cartItems'); 
      
      // --- THAY ĐỔI QUAN TRỌNG ---
      // Chuyển hướng sang trang Payment, truyền kèm số tiền cần thanh toán
      // (Lưu ý: Bạn cần tạo trang PaymentPage và khai báo route /payment/:orderId như bài trước)
      navigate(`/payment/${orderId}`, { state: { amount: totalPrice } });
      
      // Mẹo nhỏ: Reload lại trang sau 100ms để CartContext tự reset về 0 (nếu chưa có hàm clearCart)
      setTimeout(() => {
          window.location.reload();
      }, 100);

    } catch (error) {
      console.error(error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Giao diện khi giỏ hàng trống
  if (cartItems.length === 0) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <img src="https://www.coolmate.me/images/cart-empty.png" alt="Empty" className="w-48 opacity-50 mb-4"/>
              <h2 className="text-xl font-bold text-gray-700">Giỏ hàng của bạn đang trống</h2>
              <Link to="/" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700">
                  Mua sắm ngay
              </Link>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto mb-6">
         <Link to="/collections" className="text-gray-500 flex items-center gap-1 hover:text-black w-fit">
            <ArrowLeft size={18}/> Tiếp tục mua sắm
         </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán đơn hàng</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* CỘT TRÁI: FORM THÔNG TIN */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-sm h-fit border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
            <User size={20}/> Thông tin giao hàng
          </h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                  <div className="relative mt-1">
                     <User size={16} className="absolute left-3 top-3 text-gray-400"/>
                     <input required name="fullName" value={customer.fullName} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="Nguyễn Văn A" />
                  </div>
               </div>
               <div>
                  <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                  <div className="relative mt-1">
                     <Phone size={16} className="absolute left-3 top-3 text-gray-400"/>
                     <input required name="phone" value={customer.phone} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="0987..." />
                  </div>
               </div>
            </div>

            <div>
               <label className="text-sm font-medium text-gray-700">Email (để nhận hóa đơn)</label>
               <div className="relative mt-1">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400"/>
                  <input required type="email" name="email" value={customer.email} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="email@example.com" />
               </div>
            </div>

            <div>
               <label className="text-sm font-medium text-gray-700">Địa chỉ nhận hàng</label>
               <div className="relative mt-1">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400"/>
                  <input required name="address" value={customer.address} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="Số nhà, đường, phường/xã..." />
               </div>
            </div>

             <div>
               <label className="text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
               <textarea name="note" value={customer.note} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none mt-1 bg-gray-50 focus:bg-white transition-colors" rows="2" placeholder="Giao giờ hành chính..." />
            </div>
          </form>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="w-full lg:w-1/3">
           <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24 border border-gray-100">
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Đơn hàng của bạn ({cartItems.length})</h2>
              
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                 {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-3">
                       <div className="relative w-16 h-20 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded border"/>
                          <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                             {item.quantity}
                          </span>
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                          <div className="text-xs text-gray-500 mt-1">
                             {item.color} / {item.size}
                          </div>
                          <div className="text-sm font-bold text-black mt-1">
                             {(item.price * item.quantity).toLocaleString()}đ
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="border-t pt-4 space-y-2 text-sm">
                 <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                 </div>
                 <div className="flex justify-between text-xl font-black border-t pt-3 mt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{totalPrice.toLocaleString()}đ</span>
                 </div>
              </div>

              <button 
                 form="checkout-form"
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase mt-6 hover:opacity-80 transition-opacity flex justify-center items-center gap-2 shadow-lg shadow-gray-400/50"
              >
                 {loading ? 'Đang xử lý...' : <> <CreditCard size={20}/> ĐẶT HÀNG NGAY </>}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;