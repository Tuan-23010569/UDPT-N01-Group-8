import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, CreditCard } from 'lucide-react'; // 1. Import CreditCard
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra bảo mật: Nếu chưa có token thì đá về trang Login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      // 1. Xóa token
      localStorage.removeItem('token');
      // 2. Thông báo
      toast.info('Đã đăng xuất');
      // 3. Chuyển về login
      navigate('/login');
    }
  };

  // 2. Thêm mục Quản lý Thanh toán vào đây
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Quản lý Sản phẩm', icon: Package, path: '/admin/products' },
    { name: 'Đơn hàng', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Quản lý Thanh toán', icon: CreditCard, path: '/admin/payments' }, // <--- Mới thêm
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-widest text-white">ADMIN</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            // Kiểm tra active cho cả đường dẫn con (VD: /admin/products/add vẫn sáng nút Sản phẩm)
            // Logic: path hiện tại bắt đầu bằng path menu VÀ xử lý riêng cho Dashboard (/) tránh trùng
            const isActive = item.path === '/admin' 
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          {/* NÚT ĐĂNG XUẤT */}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-slate-800 w-full px-4 py-3 rounded-lg transition-colors"
          >
            <LogOut size={20} /> 
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 justify-between sticky top-0 z-10 shrink-0">
          <h2 className="text-lg font-bold text-gray-700">Hệ thống quản trị</h2>
          <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">A</div>
              <span className="text-sm font-medium text-gray-600">Admin User</span>
          </div>
        </header>
        <div className="p-8 flex-1">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;