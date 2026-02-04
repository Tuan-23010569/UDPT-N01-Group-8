import React, { useState } from 'react';
import { Search, User, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';

// Dữ liệu Mega Menu (Giống hệt ảnh bạn gửi)
const NAM_MENU_DATA = [
  {
    title: "TẤT CẢ SẢN PHẨM",
    link: "/products",
    isHighlight: true,
    items: [
      { name: "Sản phẩm mới", link: "/products?tag=new", active: true },
      { name: "Bán chạy nhất", link: "/products?tag=best", bold: true },
      { name: "Cool Set", link: "/products?tag=set" },
      { name: "ECC Collection", link: "/products?collection=ecc" },
      { name: "Excool Collection", link: "/products?collection=excool" },
      { name: "Seamless", link: "/products?tag=seamless" },
      { name: "Promax", link: "/products?tag=promax" },
      { name: "Đồ Thu Đông", link: "/products?tag=winter" },
    ]
  },
  {
    title: "ÁO NAM",
    link: "/products?cat=ao-nam",
    items: [
      { name: "Áo Tanktop", link: "/" },
      { name: "Áo thun", link: "/" },
      { name: "Áo Thể Thao", link: "/" },
      { name: "Áo Polo", link: "/" },
      { name: "Áo Sơ Mi", link: "/" },
      { name: "Áo Dài Tay", link: "/" },
      { name: "Áo Sweater", link: "/" },
      { name: "Áo Hoodie", link: "/" },
      { name: "Áo Khoác", link: "/" },
      { name: "Áo thun Graphic", link: "/" },
    ]
  },
  {
    title: "QUẦN NAM",
    link: "/products?cat=quan-nam",
    items: [
      { name: "Quần Short", link: "/" },
      { name: "Quần Jogger", link: "/" },
      { name: "Quần Thể Thao", link: "/" },
      { name: "Quần Dài", link: "/" },
      { name: "Quần Pants", link: "/" },
      { name: "Quần Jean", link: "/" },
      { name: "Quần Kaki", link: "/" },
      { name: "Quần Bơi", link: "/" },
    ]
  },
  {
    title: "QUẦN LÓT NAM",
    link: "/products?cat=underwear",
    items: [
      { name: "Brief (Tam giác)", link: "/" },
      { name: "Trunk (Boxer)", link: "/" },
      { name: "Boxer Brief (Boxer dài)", link: "/" },
      { name: "Long Leg", link: "/" },
      { name: "Short mặc nhà", link: "/" },
    ]
  },
  {
    title: "PHỤ KIỆN",
    link: "/products?cat=accessories",
    items: [
      { name: "Tất cả phụ kiện", link: "/" },
      { name: "(Tất, mũ, túi...)", link: "/", italic: true },
    ]
  }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token'); 

  const handleLogout = () => {
      localStorage.removeItem('token');
      window.location.reload();
  };

  return (
    <>
      {/* Topbar */}
      <div className="bg-cool-dark text-white text-center text-[12px] py-2 font-medium z-50 relative">
        Miễn phí vận chuyển đơn hàng trên 200k - Đổi trả 60 ngày
      </div>

      <header className="sticky top-0 z-40 bg-white shadow-sm font-sans">
        <div className="container mx-auto px-4 md:px-10 h-[80px] flex items-center justify-between">
          
          {/* 1. LOGO */}
          <div className="flex items-center gap-4 w-[250px]"> {/* Set width cố định để dễ căn giữa menu */}
            <Menu className="lg:hidden cursor-pointer" onClick={() => setIsMenuOpen(true)} />
            <Link to="/" className="flex flex-col items-center leading-none group select-none">
                <div className="flex items-end gap-[2px]">
                   <div className="mb-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2V22M2 12H22" stroke="black" strokeWidth="5" strokeLinecap="round"/></svg>
                   </div>
                   <span className="text-[26px] font-black tracking-tighter text-black">SHOP</span>
                   <span className="bg-black text-white text-[18px] font-bold px-[4px] rounded-[2px] mb-[3px]">THT</span>
                </div>
            </Link>
          </div>

          {/* 2. MENU CHÍNH (CĂN GIỮA - XÓA NỮ/SALE/SPORT) */}
          <nav className="hidden xl:flex items-center justify-center gap-12 font-bold text-[14px] uppercase tracking-wide text-gray-800 h-full flex-1">
            <Link to="/products?tag=new" className="hover:text-cool-blue h-full flex items-center relative group">
                NEW
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cool-blue transition-all group-hover:w-full"></span>
            </Link>
            
            {/* MỤC "NAM" CÓ MEGA MENU */}
            <div className="group h-full flex items-center relative cursor-pointer">
               <Link to="/products?cat=nam" className="hover:text-cool-blue h-full flex items-center transition-all relative">
                  NAM
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cool-blue transition-all group-hover:w-full"></span>
               </Link>

               {/* --- MEGA MENU DROPDOWN --- */}
               {/* Sử dụng fixed inset-x-0 top-[header-height] để full width màn hình chuẩn nhất */}
               <div className="fixed top-[112px] left-0 w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 invisible opacity-0 translate-y-4 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 z-50">
                  <div className="container mx-auto px-10 py-10">
                     <div className="grid grid-cols-5 gap-8">
                        {NAM_MENU_DATA.map((col, idx) => (
                           <div key={idx} className="flex flex-col gap-4">
                              <Link to={col.link} className="font-extrabold text-[15px] flex items-center gap-1 hover:text-cool-blue uppercase">
                                 {col.title} <ArrowRight size={16} className="text-cool-blue"/>
                              </Link>
                              
                              <div className="flex flex-col gap-2.5">
                                 {col.items.map((item, i) => (
                                    <Link 
                                       key={i} 
                                       to={item.link} 
                                       className={`text-[14px] hover:text-cool-blue transition-colors block
                                          ${item.active ? 'text-cool-blue font-bold' : 'text-gray-500'}
                                          ${item.bold ? 'font-bold text-gray-800' : ''}
                                          ${item.italic ? 'italic text-gray-400 font-normal' : ''}
                                       `}
                                    >
                                       {item.name}
                                    </Link>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <Link to="/products?cat=accessories" className="hover:text-cool-blue h-full flex items-center relative group">
                PHỤ KIỆN
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cool-blue transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* 3. ICONS RIGHT */}
          <div className="flex items-center justify-end gap-4 w-[250px]">
            <div className="hidden lg:flex items-center border-b border-gray-300 py-1 w-[180px] focus-within:border-black transition-colors bg-white">
              <Search size={18} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Tìm kiếm..." className="bg-transparent outline-none w-full text-sm placeholder-gray-400 text-black font-medium" />
            </div>

            {isLoggedIn ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cool-blue cursor-pointer" onClick={handleLogout}>Member</span>
                    {/* <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Thoát</button> */}
                </div>
            ) : (
                <button onClick={() => setShowAuth(true)} className="text-sm font-bold text-cool-blue hover:opacity-80">
                  Member
                </button>
            )}

            <Link to="/cart" className="relative p-1 hover:opacity-70 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="black" strokeWidth="2" strokeLinejoin="round"/><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
               <span className="absolute -top-1 -right-1 bg-cool-dark text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">0</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-white w-[300px] h-full shadow-2xl p-6" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-8 pb-4 border-b">
                 <span className="font-black text-xl">MENU</span>
                 <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
               </div>
               <div className="flex flex-col gap-6 font-bold uppercase text-[15px]">
                  <Link to="/products?tag=new">New</Link>
                  <Link to="/products?cat=nam">Nam</Link>
                  <Link to="/products?cat=accessories">Phụ kiện</Link>
                  <button onClick={() => { setIsMenuOpen(false); setShowAuth(true); }} className="text-left text-cool-blue">Đăng nhập</button>
               </div>
            </div>
          </div>
        )}
      </header>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Header;