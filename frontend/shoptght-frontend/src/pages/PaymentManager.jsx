import React, { useEffect, useState } from 'react';
import orderApi from '../api/orderApi';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';

const PaymentManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentUpdate = async (id, currentStatus) => {
    // Logic đảo ngược: Nếu đang UNPAID thì chuyển thành PAID và ngược lại
    const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    
    if(!window.confirm(`Xác nhận đổi sang trạng thái: ${newStatus}?`)) return;

    try {
      await orderApi.updatePaymentStatus(id, newStatus);
      fetchOrders(); // Load lại bảng
    } catch (error) {
      alert("Lỗi cập nhật");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <CreditCard /> Quản Lý Thanh Toán
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Mã Đơn</th>
              <th className="px-4 py-3 text-left font-bold">Khách Hàng</th>
              <th className="px-4 py-3 text-left font-bold">Số Tiền</th>
              <th className="px-4 py-3 text-left font-bold">Hình Thức</th>
              <th className="px-4 py-3 text-center font-bold">Trạng Thái Tiền</th>
              <th className="px-4 py-3 text-center font-bold">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-bold">#{order.id}</td>
                <td className="px-4 py-4">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</div>
                </td>
                <td className="px-4 py-4 font-bold text-red-600">
                    {order.totalAmount?.toLocaleString()}đ
                </td>
                <td className="px-4 py-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                        {order.paymentMethod || 'COD'}
                    </span>
                </td>
                <td className="px-4 py-4 text-center">
                    {order.paymentStatus === 'PAID' ? (
                        <span className="text-green-600 font-bold flex items-center justify-center gap-1">
                            <CheckCircle size={16}/> Đã TT
                        </span>
                    ) : (
                        <span className="text-red-500 font-bold flex items-center justify-center gap-1">
                            <XCircle size={16}/> Chưa TT
                        </span>
                    )}
                </td>
                <td className="px-4 py-4 text-center">
                    {order.paymentStatus !== 'PAID' ? (
                        <button 
                            onClick={() => handlePaymentUpdate(order.id, order.paymentStatus)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                        >
                            Xác nhận đã thu
                        </button>
                    ) : (
                        <button 
                            onClick={() => handlePaymentUpdate(order.id, order.paymentStatus)}
                            className="text-gray-400 text-sm hover:text-red-500 underline"
                        >
                            Hoàn tác
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManager;