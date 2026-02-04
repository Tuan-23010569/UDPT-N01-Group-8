import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import orderApi from '../api/orderApi';
import { toast } from 'react-toastify';

const OrderSuccess = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL

  // Hàm xử lý tải hóa đơn
  const handleDownloadInvoice = async () => {
    try {
      const response = await orderApi.getInvoice(id);
      
      // Tạo một URL ảo cho file PDF blob
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${id}.pdf`); // Đặt tên file tải về
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success("Đang tải hóa đơn...");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải hóa đơn!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
           <CheckCircle size={80} className="text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-500 mb-6">
           Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là: <br/>
           <span className="text-xl font-black text-blue-600">#{id}</span>
        </p>

        <div className="space-y-3">
           {/* Nút Tải Hóa Đơn */}
           <button 
             onClick={handleDownloadInvoice}
             className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 hover:text-black flex items-center justify-center gap-2 transition-colors"
           >
              <Download size={20} /> Tải hóa đơn (PDF)
           </button>

           {/* Nút Về Trang Chủ */}
           <Link to="/" className="block w-full bg-black text-white py-3 rounded-lg font-bold hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
              Tiếp tục mua sắm <ArrowRight size={20}/>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;