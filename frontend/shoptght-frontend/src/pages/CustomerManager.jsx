import React, { useEffect, useState } from 'react';
import authApi from '../api/authApi';   // <--- Thay userApi bằng authApi
import orderApi from '../api/orderApi'; // <--- Thêm orderApi
import { User, Lock, Unlock, Eye, MapPin, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

const CustomerManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Load danh sách
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Gọi API lấy danh sách User từ Auth Service
      const data = await authApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Khóa/Mở
  const handleToggleLock = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn ${user.locked ? 'MỞ KHÓA' : 'KHÓA'} tài khoản này?`)) return;
    
    try {
      // Gọi API khóa tài khoản từ Auth Service
      await authApi.toggleLock(user.id);
      
      toast.success("Cập nhật trạng thái thành công!");
      fetchUsers(); // Load lại list
    } catch (error) {
      console.error(error);
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  // Xem chi tiết & Lịch sử
  const handleViewDetail = async (user) => {
    setSelectedUser(user);
    setHistory([]); // Reset lịch sử cũ trước khi load mới
    
    try {
        // Gọi API lấy lịch sử đơn hàng từ Order Service
        const orders = await orderApi.getHistoryByEmail(user.email);
        setHistory(orders);
    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
        // Không cần toast lỗi ở đây, chỉ cần để trống lịch sử
        setHistory([]);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải danh sách...</div>;

  return (
    <div className="flex gap-6 h-[calc(100vh-100px)]">
      
      {/* CỘT TRÁI: DANH SÁCH KHÁCH HÀNG */}
      <div className={`${selectedUser ? 'w-2/3' : 'w-full'} bg-white rounded-lg shadow-sm p-6 transition-all flex flex-col`}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="text-blue-600"/> Danh sách Khách hàng
        </h2>
        
        <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
                <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ Tên</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-600">#{user.id}</td>
                    <td className="px-4 py-3 font-medium">{user.fullName || 'Chưa đặt tên'}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                        {user.locked ? (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">Đã khóa</span>
                        ) : (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Hoạt động</span>
                        )}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                        <button 
                            onClick={() => handleViewDetail(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Xem chi tiết"
                        >
                            <Eye size={18}/>
                        </button>
                        <button 
                            onClick={() => handleToggleLock(user)}
                            className={`p-2 rounded hover:bg-gray-100 transition-colors ${user.locked ? 'text-green-600' : 'text-red-500'}`}
                            title={user.locked ? "Mở khóa" : "Khóa tài khoản"}
                        >
                            {user.locked ? <Unlock size={18}/> : <Lock size={18}/>}
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* CỘT PHẢI: CHI TIẾT (Chỉ hiện khi chọn User) */}
      {selectedUser && (
          <div className="w-1/3 bg-white rounded-lg shadow-sm p-6 overflow-y-auto border-l border-gray-100">
              <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                      <h3 className="text-lg font-bold text-gray-800">{selectedUser.fullName || 'User #' + selectedUser.id}</h3>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-red-500 text-sm font-medium">Đóng</button>
              </div>

              {/* Thông tin liên hệ */}
              <div className="mb-6 space-y-3">
                  <div className="flex gap-2 items-center text-gray-700">
                      <MapPin size={18} className="text-blue-500"/>
                      <span className="font-bold text-sm">Địa chỉ giao hàng gần nhất:</span>
                  </div>
                  <p className="pl-7 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 italic">
                      {/* Lấy địa chỉ từ đơn hàng mới nhất */}
                      {history.length > 0 && history[0].address ? history[0].address : "Chưa có đơn hàng hoặc không có địa chỉ."}
                  </p>
              </div>

              {/* Lịch sử mua hàng */}
              <div>
                  <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <ShoppingBag size={18} className="text-purple-500"/> Lịch sử đơn hàng ({history.length})
                  </h4>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {history.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4 bg-gray-50 rounded">Khách chưa có đơn hàng nào.</p>
                      ) : (
                          history.map(order => (
                              <div key={order.id} className="border rounded p-3 text-sm hover:shadow-md transition-shadow bg-white cursor-default">
                                  <div className="flex justify-between mb-2">
                                      <span className="font-bold text-gray-800">#{order.orderNumber ? order.orderNumber.substring(0,8) : order.id}</span>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                          'bg-yellow-100 text-yellow-700'
                                      }`}>
                                          {order.status}
                                      </span>
                                  </div>
                                  <div className="flex justify-between text-gray-500 text-xs mb-1">
                                      <span>Ngày đặt:</span>
                                      <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between items-end mt-2 pt-2 border-t border-dashed">
                                      <span className="text-xs text-gray-400">{order.paymentMethod || 'COD'}</span>
                                      <span className="font-bold text-red-600 text-base">
                                          {order.totalAmount?.toLocaleString()}đ
                                      </span>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default CustomerManager;