import React, { useEffect, useState } from 'react';
import orderApi from '../api/orderApi';
import { Printer, Eye } from 'lucide-react'; // Cài lucide-react nếu chưa có, hoặc dùng icon khác

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách đơn hàng khi vào trang
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAll();
      setOrders(response);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đổi trạng thái
  const handleStatusChange = async (orderId, newStatus) => {
    // Hỏi xác nhận trước khi đổi
    const confirm = window.confirm(`Bạn có chắc muốn đổi trạng thái thành "${newStatus}"?`);
    if (!confirm) return;

    try {
      await orderApi.updateStatus(orderId, newStatus);
      alert("Cập nhật thành công!");
      fetchOrders(); // Load lại bảng để thấy thay đổi
    } catch (error) {
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  // Hàm in hóa đơn (Mở tab mới gọi API PDF)
  const handlePrintInvoice = (orderId) => {
    // Lưu ý: Đổi localhost:8080 thành đường dẫn thật của Backend bạn nếu khác
    window.open(`http://localhost:8080/orders/invoice/${orderId}`, '_blank');
  };

  // Helper: Chọn màu sắc cho trạng thái
  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPING: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản Lý Đơn Hàng</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Đơn</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách Hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng Tiền</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày Đặt</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng Thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành Động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap font-bold text-gray-700">#{order.id}</td>
                
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.phone}</div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-red-600 font-bold">
                  {order.totalAmount?.toLocaleString()}đ
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                   {/* Format ngày tháng nếu có */}
                   {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {/* Select box đổi trạng thái nhanh */}
                    <select 
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="SHIPPING">Đang giao</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELLED">Hủy đơn</option>
                    </select>

                    {/* Nút in hóa đơn */}
                    <button 
                      onClick={() => handlePrintInvoice(order.id)}
                      className="p-1 text-gray-500 hover:text-blue-600 border rounded hover:bg-blue-50"
                      title="In hóa đơn"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {orders.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">Chưa có đơn hàng nào.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;