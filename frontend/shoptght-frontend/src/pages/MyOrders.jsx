import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { Package, Calendar, MapPin, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify'; // Import thêm toast để báo lỗi

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    
    // 1. Kiểm tra nếu chưa đăng nhập
    if (!userStr) {
        navigate('/login'); 
        return;
    }

    try {
        const user = JSON.parse(userStr);
        
        // 2. Kiểm tra quan trọng: User có email không?
        if (!user || !user.email) {
            console.error("Lỗi: Không tìm thấy email trong thông tin User", user);
            toast.error("Vui lòng đăng xuất và đăng nhập lại để tải dữ liệu!");
            setLoading(false);
            return;
        }

        // 3. Chỉ gọi API khi chắc chắn có email
        fetchOrders(user.email); 
        
    } catch (e) {
        console.error("Lỗi parse JSON user:", e);
        // Nếu localStorage lỗi rác, xóa đi bắt đăng nhập lại
        localStorage.removeItem('user');
        navigate('/login');
    }
  }, [navigate]);

  const fetchOrders = async (email) => {
    try {
        const data = await orderApi.getMyOrders(email);
        setOrders(data);
    } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
    } finally {
        setLoading(false);
    }
  };

  const getStatusColor = (status) => {
      switch (status) {
          case 'COMPLETED': return 'bg-green-100 text-green-700';
          case 'SHIPPING': return 'bg-blue-100 text-blue-700';
          case 'CANCELLED': return 'bg-red-100 text-red-700';
          default: return 'bg-yellow-100 text-yellow-700';
      }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center">Đang tải lịch sử đơn hàng...</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="text-blue-600"/> Đơn hàng của tôi
        </h1>

        {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3"/>
                <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                <Link to="/" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Mua sắm ngay</Link>
            </div>
        ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex gap-4 text-sm text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-400 text-xs uppercase">Ngày đặt</p>
                                    <p className="font-bold text-gray-800 flex items-center gap-1">
                                        <Calendar size={14}/> 
                                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-400 text-xs uppercase">Tổng tiền</p>
                                    <p className="font-bold text-red-600">
                                        {order.totalAmount?.toLocaleString()}đ
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            {order.orderItems && order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0 border-dashed border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 font-bold">
                                            {item.productName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{item.productName}</p>
                                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {(item.price * item.quantity).toLocaleString()}đ
                                    </p>
                                </div>
                            ))}
                            
                            <div className="mt-4 pt-4 border-t flex items-start gap-2 text-sm text-gray-600">
                                <MapPin size={16} className="mt-0.5 text-blue-500 shrink-0"/>
                                <span>Giao đến: {order.address || "Địa chỉ mặc định"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;