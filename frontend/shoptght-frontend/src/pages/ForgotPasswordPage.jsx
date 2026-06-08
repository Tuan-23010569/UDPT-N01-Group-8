import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Giả sử backend có API /auth/forgot-password nhận email
            await authApi.forgotPassword({ email });
            toast.success('Yêu cầu đã được gửi! Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
            navigate('/login');
        } catch (error) {
            console.error("Forgot Password Error:", error);
            // Lấy thông báo lỗi từ backend nếu có, không thì dùng mặc định
            const errorMessage = error.response?.data?.message || error.response?.data || 'Gửi yêu cầu thất bại. Vui lòng thử lại.';
            // Nếu backend trả về 404, hiển thị thông báo email không tồn tại
            toast.error(error.response?.status === 404 ? 'Email không tồn tại trong hệ thống.' : errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-100">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h1>
                    <p className="text-gray-500 text-sm mt-1">Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-black"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        <Mail size={18} /> {loading ? 'Đang gửi...' : 'GỬI YÊU CẦU'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <Link to="/login" className="text-black font-bold hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Quay lại Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;