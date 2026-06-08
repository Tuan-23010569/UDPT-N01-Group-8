import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Landmark, CheckCircle, ArrowRight, Banknote } from 'lucide-react';
import paymentApi from '../api/paymentApi';
import { toast } from 'react-toastify';

const PaymentPage = () => {
   const { orderId } = useParams();
   const location = useLocation();
   const navigate = useNavigate();

   // Lấy dữ liệu từ trang Checkout
   const amount = location.state?.amount || 0;
   const initialMethod = location.state?.method || 'COD';

   // State cho phương thức thanh toán, khởi tạo từ trang trước
   const [method, setMethod] = useState(initialMethod);
   const [loading, setLoading] = useState(false);

   const handlePayment = async () => {
      setLoading(true);

      // Xử lý cho COD và Banking (demo)
      try {
         // Logic này chỉ mang tính chất demo, chuyển hướng người dùng sau khi chọn.
         // Việc xác nhận thanh toán thực tế (đặc biệt với chuyển khoản) cần xử lý ở admin.

         toast.success(method === 'COD' ? "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng." : "Đã ghi nhận yêu cầu. Vui lòng hoàn tất chuyển khoản.");
         navigate(`/order-success/${orderId}`);
      } catch (error) {
         console.error(error);
         toast.error("Xác nhận thất bại, vui lòng thử lại!");
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
                     <div className="bg-white p-2 rounded-full shadow-sm text-green-600"><Banknote size={24} /></div>
                     <div>
                        <h4 className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</h4>
                        <p className="text-sm text-gray-500">Thanh toán tiền mặt cho shipper khi nhận được hàng.</p>
                     </div>
                  </label>

                  {/* Option 2: Chuyển khoản */}
                  <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${method === 'BANKING' ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'}`}>
                     <input type="radio" name="payment" className="w-5 h-5 accent-blue-600" checked={method === 'BANKING'} onChange={() => setMethod('BANKING')} />
                     <div className="bg-white p-2 rounded-full shadow-sm text-blue-600"><Landmark size={24} /></div>
                     <div>
                        <h4 className="font-bold text-gray-800">Chuyển khoản ngân hàng (QR Code)</h4>
                        <p className="text-sm text-gray-500">Quét mã QR qua ứng dụng ngân hàng (VietQR).</p>
                     </div>
                  </label>
               </div>
            </div>

            {/* --- CỘT PHẢI: HIỂN THỊ TÙY THEO PHƯƠNG THỨC --- */}

            {/* 1. HIỂN THỊ MÃ QR KHI CHỌN BANKING */}
            {method === 'BANKING' ? (
               <div className="w-full md:w-1/3 bg-gray-50 p-8 border-l border-gray-200 flex flex-col items-center text-center">
                  <h3 className="text-lg font-bold mb-4 text-gray-700">Quét mã QR để thanh toán</h3>
                  <img
                     src={`https://img.vietqr.io/image/techcombank-19036868868888-compact.png?amount=${amount}&addInfo=TT%20${orderId}&accountName=CONG%20TY%20TNHH%20SHOPTHT`}
                     alt="QR Code thanh toán"
                     className="w-56 h-56 rounded-lg shadow-lg border-4 border-white"
                  />
                  <div className="text-left mt-4 text-sm space-y-1 text-gray-600 bg-white p-3 rounded-lg w-full">
                     <p>Ngân hàng: <span className="font-bold">Techcombank (Demo)</span></p>
                     <p>Chủ tài khoản: <span className="font-bold">CONG TY TNHH SHOPTHT</span></p>
                     <p>Số tiền: <span className="font-bold text-red-600">{amount.toLocaleString()}đ</span></p>
                     <p>Nội dung: <span className="font-bold text-blue-600">TT {orderId}</span></p>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 p-2 bg-yellow-50 rounded-md">Vui lòng chuyển khoản đúng nội dung để được xác nhận tự động.</p>
                  <button
                     onClick={handlePayment}
                     disabled={loading}
                     className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mt-6 hover:bg-green-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-green-200"
                  >
                     {loading ? 'Đang xử lý...' : <> <CheckCircle size={20} /> Tôi đã chuyển khoản </>}
                  </button>
               </div>
            ) : (
               /* 2. TÓM TẮT CHO PHƯƠNG THỨC COD */
               <div className="w-full md:w-1/3 bg-gray-50 p-8 border-l border-gray-200 flex flex-col justify-between">
                  <div>
                     <h3 className="text-lg font-bold mb-4 text-gray-700">Đơn hàng #{orderId}</h3>
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
                     {loading ? 'Đang xử lý...' : <> Hoàn tất đặt hàng <ArrowRight size={20} /></>}
                  </button>
               </div>
            )}

         </div>
      </div>
   );
};

export default PaymentPage;