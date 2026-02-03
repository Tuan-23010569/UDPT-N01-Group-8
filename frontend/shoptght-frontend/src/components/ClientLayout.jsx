import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
// Import đầy đủ các icon
import { Search, ShoppingBag, User, LogOut, Package, Ticket, History, MapPin, Settings, Star, HelpCircle } from 'lucide-react';

const ClientLayout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('USER'); // Mặc định là User
  
  // State quản lý từ khóa tìm kiếm
  const [keyword, setKeyword] = useState('');

  // 1. Kiểm tra đăng nhập và quyền khi load trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    
    if (token) {
        setIsLoggedIn(true);
        if (savedRole) setRole(savedRole);
    }
  }, []);

  // 2. Hàm Đăng xuất
  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
      navigate('/login');
      window.location.reload(); 
  };

  // 3. Hàm Xử lý Tìm kiếm (Nhấn Enter)
  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
        navigate(`/search?q=${keyword}`); // Chuyển sang trang kết quả
        setKeyword(''); // Xóa ô nhập liệu
    }
  };

  return (
    <div className="font-sans text-gray-800">
      {/* 1. TOP BAR */}
      <div className="bg-black text-white text-center text-xs py-2 font-bold tracking-wide">
        Miễn phí vận chuyển đơn hàng trên 200k - Đổi trả trong 60 ngày
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex flex-col items-center leading-none group">
             <span className="text-3xl font-black tracking-tighter">COOL</span>
             <span className="bg-black text-white text-xs font-bold px-1 rounded-sm tracking-widest">MATE</span>
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-sm uppercase">
            <Link to="/collections?cat=nam" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
            <Link to="/collections?cat=underwear" className="hover:text-blue-600 transition-colors">Đồ lót</Link>
            <Link to="/collections?cat=daily" className="hover:text-blue-600 transition-colors">Mặc hàng ngày</Link>
            <Link to="/collections?cat=sport" className="hover:text-blue-600 transition-colors">Thể thao</Link>
            <Link to="/collections?tag=sale" className="text-red-600 relative">
                Sale Tết <span className="absolute -top-3 -right-4 text-[9px] bg-red-600 text-white px-1 rounded">-50%</span>
            </Link>
          </nav>

          {/* ICONS RIGHT */}
          <div className="flex items-center gap-5">
            {/* Search Box (Đã gắn sự kiện) */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 focus-within:ring-1 ring-black transition-all">
               <Search size={18} className="text-gray-400"/>
               <input 
                  className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-gray-400" 
                  placeholder="Tìm kiếm sản phẩm..." 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearch} // <--- Gắn sự kiện Enter
               />
            </div>

            {/* --- USER ICON & DROPDOWN MENU --- */}
            <div className="relative group py-4"> 
               {/* Icon User Chính */}
               <Link to={isLoggedIn ? "#" : "/login"} className="hover:opacity-70 block">
                  <User size={24} />
               </Link>

               {/* MENU SỔ XUỐNG (Chỉ hiện khi đã đăng nhập + Hover vào vùng cha) */}
               {isLoggedIn && (
                   <div className="absolute right-0 top-[calc(100%-10px)] w-[320px] bg-white shadow-xl rounded-xl border border-gray-100 p-3 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
                      
                      {/* Header Menu: Tên & Role */}
                      <div className="px-2 pb-3 mb-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Xin chào,</p>
                          <p className="font-bold text-base text-blue-600">
                              {role === 'ADMIN' ? 'Quản Trị Viên' : 'Thành Viên Coolmate'}
                          </p>
                      </div>

                      {/* --- PHẦN RIÊNG CHO ADMIN (Chỉ Admin mới thấy) --- */}
                      {role === 'ADMIN' && (
                        <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold mb-3 transition-colors">
                           <Package size={20} />
                           Quản lý sản phẩm (Admin)
                        </Link>
                      )}

                      {/* --- GRID TIỆN ÍCH CHO USER (Ai cũng thấy) --- */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                          <Link to="/vouchers" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center gap-1 transition-colors">
                              <Ticket size={24} className="mb-1 text-gray-700"/> 
                              <span className="text-xs font-bold text-gray-700">Ví Voucher</span>
                          </Link>
                          <Link to="/orders" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center gap-1 transition-colors">
                              <History size={24} className="mb-1 text-gray-700"/> 
                              <span className="text-xs font-bold text-gray-700">Lịch sử đơn</span>
                          </Link>
                          <Link to="/address" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center gap-1 transition-colors">
                              <MapPin size={24} className="mb-1 text-gray-700"/> 
                              <span className="text-xs font-bold text-gray-700">Sổ địa chỉ</span>
                          </Link>
                          <Link to="/profile" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center gap-1 transition-colors">
                              <Settings size={24} className="mb-1 text-gray-700"/> 
                              <span className="text-xs font-bold text-gray-700">Cài đặt TK</span>
                          </Link>
                          <Link to="/reviews" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center gap-1 transition-colors">
                              <Star size={24} className="mb-1 text-gray-700"/> 
                              <span className="text-xs font-bold text-gray-700">Đánh giá</span>
                          </Link>
                          <Link to="/faq" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center gap-1 transition-colors">
                              <HelpCircle size={24} className="mb-1 text-gray-700"/> 
                              <span className="text-xs font-bold text-gray-700">Hỗ trợ & FAQ</span>
                          </Link>
                      </div>

                      {/* --- NÚT ĐĂNG XUẤT --- */}
                      <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 py-2 text-red-500 font-bold hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      >
                          <LogOut size={18} /> Đăng xuất
                      </button>
                   </div>
               )}
            </div>

            {/* Cart Icon */}
            <div className="relative cursor-pointer hover:opacity-70">
               <ShoppingBag size={24} />
               <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">0</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. NỘI DUNG CHÍNH */}
      <main className="min-h-screen">
         <Outlet />
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 text-white py-12">
         <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
               <h3 className="text-2xl font-bold mb-4">COOLMATE</h3>
               <p className="text-gray-400 text-sm">Trải nghiệm mua sắm hài lòng 100%.</p>
            </div>
            {/* Các cột footer giữ nguyên */}
            <div><h4 className="font-bold mb-4">CHÍNH SÁCH</h4><ul className="text-gray-400 text-sm space-y-2"><li>Chính sách đổi trả</li><li>Chính sách bảo mật</li></ul></div>
            <div><h4 className="font-bold mb-4">HỖ TRỢ</h4><ul className="text-gray-400 text-sm space-y-2"><li>Tra cứu đơn hàng</li><li>Hướng dẫn chọn size</li></ul></div>
            <div><h4 className="font-bold mb-4">LIÊN HỆ</h4><p className="text-gray-400 text-sm">Hotline: 1900.27.27.37</p></div>
         </div>
      </footer>
    </div>
  );
};

export default ClientLayout;