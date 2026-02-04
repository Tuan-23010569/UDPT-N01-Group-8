import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CreditCard, Truck, Landmark, CheckCircle, ArrowRight } from 'lucide-react';
import paymentApi from '../api/paymentApi';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy số tiền từ trang trước truyền sang (để đỡ phải gọi API lấy lại)
  const amount = location.state?.amount || 0; 

  const [method, setMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Gọi Payment Service
      await paymentApi.createPayment({
        orderId: orderId,
        amount: amount,
        paymentMethod: method, // 'COD', 'VNPAY', 'BANKING'
        status: 'COMPLETED' // Giả lập thanh toán thành công luôn
      });

      toast.success("Thanh toán thành công!");
      
      // 2. Chuyển sang trang Cảm ơn/Hóa đơn
      navigate(`/order-success/${orderId}`);

    } catch (error) {
      console.error(error);
      toast.error("Thanh toán thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* CỘT TRÁI: CHỌN PHƯƠNG THỨC */}
        <div className="w-full md:w-2/3 p-8">
          <h2 className="text-2xl font-bold mb-6">Chọn phương thức thanh toán</h2>
          
          <div className="space-y-4">
            {/* Option 1: COD */}
            <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${method === 'COD' ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'}`}>
               <input type="radio" name="payment" className="w-5 h-5 accent-blue-600" checked={method === 'COD'} onChange={() => setMethod('COD')} />
               <div className="bg-white p-2 rounded-full shadow-sm text-green-600"><Truck size={24}/></div>
               <div>
                  <h4 className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</h4>
                  <p className="text-sm text-gray-500">Thanh toán tiền mặt cho shipper khi nhận được hàng.</p>
               </div>
            </label>

            {/* Option 2: Chuyển khoản */}
            <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${method === 'BANKING' ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'}`}>
               <input type="radio" name="payment" className="w-5 h-5 accent-blue-600" checked={method === 'BANKING'} onChange={() => setMethod('BANKING')} />
               <div className="bg-white p-2 rounded-full shadow-sm text-blue-600"><Landmark size={24}/></div>
               <div>
                  <h4 className="font-bold text-gray-800">Chuyển khoản ngân hàng (QR Code)</h4>
                  <p className="text-sm text-gray-500">Quét mã QR qua ứng dụng ngân hàng (VietQR).</p>
               </div>
            </label>

            {/* Option 3: VNPay (Ví dụ) */}
            <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${method === 'VNPAY' ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'}`}>
               <input type="radio" name="payment" className="w-5 h-5 accent-blue-600" checked={method === 'VNPAY'} onChange={() => setMethod('VNPAY')} />
               <div className="bg-white p-2 rounded-full shadow-sm text-red-600"><CreditCard size={24}/></div>
               <div>
                  <h4 className="font-bold text-gray-800">Ví điện tử VNPay / Thẻ ATM</h4>
                  <p className="text-sm text-gray-500">Thanh toán an toàn qua cổng VNPay.</p>
               </div>
            </label>
          </div>
        </div>

        {/* CỘT PHẢI: TÓM TẮT */}
        <div className="w-full md:w-1/3 bg-gray-50 p-8 border-l border-gray-200 flex flex-col justify-between">
           <div>
              <h3 className="text-lg font-bold mb-4 text-gray-700">Đơn hàng #{orderId}</h3>
              <div className="flex justify-between mb-2 text-sm">
                 <span className="text-gray-500">Tạm tính</span>
                 <span className="font-bold">{amount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                 <span className="text-gray-500">Phí dịch vụ</span>
                 <span className="font-bold text-green-600">Miễn phí</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                 <span className="text-lg font-bold">Tổng thanh toán</span>
                 <span className="text-2xl font-black text-blue-600">{amount.toLocaleString()}đ</span>
              </div>
           </div>

           <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-8 hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-200"
           >
              {loading ? 'Đang xử lý...' : <> Xác nhận thanh toán <ArrowRight size={20}/></>}
           </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;