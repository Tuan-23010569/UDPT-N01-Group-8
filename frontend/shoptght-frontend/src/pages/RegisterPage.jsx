import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mật khẩu
    if (formData.password !== formData.confirmPassword) {
        toast.warning('Mật khẩu nhập lại không khớp!');
        return;
    }

    setLoading(true);
    try {
      // Gọi API Register (Backend AuthService cần map đúng các field này)
      await authApi.register({
          name: formData.name, // Username hoặc Tên
          email: formData.email,
          password: formData.password
      });

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Đăng ký thất bại! Có thể tên/email đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản mới</h1>
          <p className="text-gray-500 text-sm mt-1">Gia nhập đội ngũ ShopTHT Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên hiển thị / Username</label>
            <input required name="name" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-black" placeholder="Ví dụ: admin01" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input required type="email" name="email" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-black" placeholder="admin@coolmate.me" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input required type="password" name="password" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-black" placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nhập lại mật khẩu</label>
            <input required type="password" name="confirmPassword" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-black" placeholder="••••••••" />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-2"
          >
             <UserPlus size={18}/> {loading ? 'Đang tạo...' : 'ĐĂNG KÝ TÀI KHOẢN'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Đã có tài khoản? <Link to="/login" className="text-black font-bold hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;