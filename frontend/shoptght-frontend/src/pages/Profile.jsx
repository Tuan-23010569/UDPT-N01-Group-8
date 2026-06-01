import React, { useEffect, useState } from 'react';
import { User, Mail, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Lỗi parse user:", error);
      }
    } else {
      navigate('/login'); // Nếu chưa đăng nhập thì đẩy về trang Login
    }
  }, [navigate]);

  const openEditModal = () => {
    setEditForm({ name: user.name || '', email: user.email || '' });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Không tìm thấy dữ liệu người dùng hợp lệ!");
      return;
    }
    setIsUpdating(true);
    try {
      // Gọi API cập nhật thông tin
      const updatedUser = await axiosClient.put(`/auth/users/profile/${user.id}`, editForm);
      
      // Cập nhật lại state và localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false); // Đóng modal
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Hồ sơ cá nhân</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Ảnh bìa & Avatar */}
          <div className="bg-blue-600 h-32 relative">
             <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                    <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold uppercase">
                       {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                </div>
             </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 mb-6 flex items-center gap-1 font-medium text-sm">
               {user.role === 'ADMIN' ? <ShieldCheck size={16} className="text-green-500" /> : <User size={16} />}
               Vai trò: {user.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
            </p>

            {/* Thông tin chi tiết */}
            <div className="space-y-4">
               <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm"><User size={20} /></div>
                  <div><p className="text-sm text-gray-500 font-medium">Họ và tên</p><p className="font-bold text-gray-800">{user.name}</p></div>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm"><Mail size={20} /></div>
                  <div><p className="text-sm text-gray-500 font-medium">Địa chỉ Email</p><p className="font-bold text-gray-800">{user.email}</p></div>
               </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={openEditModal} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">Cập nhật thông tin</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL CẬP NHẬT THÔNG TIN --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Cập nhật thông tin</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={isUpdating} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Profile;