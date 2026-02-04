import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.login(formData);
      // Lấy token từ response (tùy cấu trúc backend trả về)
      const token = response.token || response; 

      if (token) {
        localStorage.setItem('token', token);
        
        // --- LOGIC PHÂN QUYỀN GIẢ LẬP ---
        // Nếu username chứa chữ "admin" -> Lưu role ADMIN
        // Ngược lại -> Lưu role USER
        // (Sau này Backend trả về role thật thì sửa thành: response.role)
        if (formData.username.toLowerCase().includes('admin')) {
            localStorage.setItem('role', 'ADMIN');
            toast.success('Xin chào Quản trị viên!');
            // Admin thì vào thẳng trang quản lý
            navigate('/admin/products'); 
        } else {
            localStorage.setItem('role', 'USER');
            toast.success('Đăng nhập thành công!');
            // User thì về trang chủ mua sắm
            navigate('/'); 
        }
      } else {
        toast.error('Không nhận được token từ server');
      }
    } catch (error) {
      console.error(error);
      toast.error('Sai tên đăng nhập hoặc mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">SHOPTHT</h1>
          <p className="text-gray-500 text-sm">Đăng nhập hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="Nhập username..."
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="relative">
            <div className="flex justify-between mb-1">
                <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">Quên mật khẩu?</a>
            </div>
            <input 
              type={showPass ? "text" : "password"}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            >
                {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? 'Đang xử lý...' : (
                <>ĐĂNG NHẬP <ArrowRight size={20}/></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;