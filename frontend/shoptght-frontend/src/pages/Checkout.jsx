import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { toast } from 'react-toastify';
import { MapPin, Phone, User, Mail, CreditCard, ArrowLeft, Banknote, QrCode } from 'lucide-react';

// 1. IMPORT HOOK LẤY GIỎ HÀNG THẬT
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 2. LẤY DỮ LIỆU TỪ CONTEXT
  const { cartItems } = useCart();

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // --- STATE MỚI: PHƯƠNG THỨC THANH TOÁN ---
  const [paymentMethod, setPaymentMethod] = useState('COD'); // Mặc định là COD

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
      address: customer.address, // Lưu ý: Backend cần thêm trường này nếu muốn lưu
      note: customer.note,       // Lưu ý: Backend cần thêm trường này nếu muốn lưu
      totalAmount: totalPrice,
      
      // --- QUAN TRỌNG: GỬI PHƯƠNG THỨC THANH TOÁN ---
      paymentMethod: paymentMethod, 
      // ----------------------------------------------

      items: cartItems.map(item => ({
        productId: item.id,      // Đảm bảo khớp với DTO Backend (productCode hoặc productId)
        productCode: item.id.toString(), // Map thêm field này cho chắc (theo code Backend trước đó)
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size
      }))
    };

    try {
      const response = await orderApi.placeOrder(orderPayload);
      // Lấy Order ID từ phản hồi (xử lý linh hoạt các kiểu trả về)
      const orderId = response.data?.id || response.data || response; 
      
      toast.success("Đặt hàng thành công!");
      
      // Xóa dữ liệu giỏ hàng
      localStorage.removeItem('cartItems'); 
      
      // Chuyển hướng dựa trên phương thức thanh toán
      // Nếu là BANKING -> Sang trang Payment để quét QR
      // Nếu là COD -> Sang trang Payment nhưng chỉ hiện thông báo thành công (hoặc trang Success riêng)
      navigate(`/payment/${orderId}`, { 
          state: { 
              amount: totalPrice,
              method: paymentMethod // Truyền method sang để trang Payment hiển thị đúng UI
          } 
      });
      
      // Reload để reset Context (cách nhanh nhất nếu chưa có action clearCart)
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
        
        {/* CỘT TRÁI: FORM THÔNG TIN & THANH TOÁN */}
        <div className="w-full lg:w-2/3 space-y-6">
            
            {/* 1. THÔNG TIN GIAO HÀNG */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
                    <User size={20}/> Thông tin giao hàng
                </h2>
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                            <input required name="fullName" value={customer.fullName} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50" placeholder="Nguyễn Văn A" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input required name="phone" value={customer.phone} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50" placeholder="0987..." />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input required type="email" name="email" value={customer.email} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50" placeholder="email@example.com" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Địa chỉ nhận hàng</label>
                        <input required name="address" value={customer.address} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50" placeholder="Số nhà, đường, phường/xã..." />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
                        <textarea name="note" value={customer.note} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 ring-blue-500 outline-none bg-gray-50" rows="2" placeholder="Giao giờ hành chính..." />
                    </div>
                </form>
            </div>

            {/* 2. PHƯƠNG THỨC THANH TOÁN (MỚI THÊM) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
                    <CreditCard size={20}/> Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                    {/* Option 1: COD */}
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="COD" 
                            checked={paymentMethod === 'COD'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                        />
                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                            <Banknote size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</div>
                            <div className="text-sm text-gray-500">Bạn chỉ phải thanh toán khi đã nhận được hàng</div>
                        </div>
                    </label>

                    {/* Option 2: Banking */}
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'BANKING' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="BANKING" 
                            checked={paymentMethod === 'BANKING'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                        />
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                            <QrCode size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">Chuyển khoản ngân hàng (QR Code)</div>
                            <div className="text-sm text-gray-500">Quét mã QR để thanh toán nhanh chóng qua App ngân hàng</div>
                        </div>
                    </label>
                </div>
            </div>
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