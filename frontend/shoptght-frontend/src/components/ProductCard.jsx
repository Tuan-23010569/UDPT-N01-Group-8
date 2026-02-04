import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const ProductCard = ({ product }) => {
  // 1. Lấy hàm addToCart từ Context
  const { addToCart } = useCart(); 

  // 2. State biến thể (Chọn mặc định cái đầu tiên nếu có)
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Dùng useEffect để set variant khi product load xong (tránh lỗi null ban đầu)
  useEffect(() => {
     if (product && product.variants && product.variants.length > 0) {
         setSelectedVariant(product.variants[0]);
     }
  }, [product]);

  // 3. Logic lấy danh sách màu (Unique)
  const uniqueColors = [];
  const seenColors = new Set();
  
  if (product && product.variants) {
      product.variants.forEach(v => {
          if (!seenColors.has(v.color)) {
              seenColors.add(v.color);
              uniqueColors.push(v);
          }
      });
  }

  // 4. Xử lý click chọn màu
  const handleColorClick = (e, variant) => {
      e.preventDefault(); // Chặn Link
      e.stopPropagation();
      setSelectedVariant(variant);
  };

  // 5. Xử lý Thêm nhanh (An toàn)
  const handleQuickAdd = (e) => {
      e.preventDefault(); // Chặn Link
      e.stopPropagation();

      // Kiểm tra kỹ trước khi gọi Context để tránh lỗi
      if (!product || !selectedVariant) {
          console.warn("Chưa chọn biến thể hoặc sản phẩm lỗi");
          return;
      }
      
      // Gọi hàm thêm vào giỏ
      addToCart(product, selectedVariant);
  };
  
  // Helper: Màu sắc
  const getColorCode = (name) => {
      const map = {
          'Đen': '#000000', 'Trắng': '#FFFFFF', 
          'Xanh': '#1e3a8a', 'Xanh Navy': '#172554', 
          'Đỏ': '#dc2626', 'Xám': '#4b5563', 
          'Vàng': '#ca8a04', 'Cam': '#ea580c',
          'Xanh rêu': '#166534', 'Be': '#f5f5dc', 
          'Nâu': '#78350f', 'Tím': '#7e22ce'
      };
      return map[name] || '#cccccc'; 
  };

  // Nếu dữ liệu sản phẩm bị lỗi/null thì không render gì cả (tránh crash app)
  if (!product) return null;

  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer block h-full flex flex-col relative">
      
      {/* ẢNH SẢN PHẨM */}
      <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4] bg-gray-100">
        <img 
          src={selectedVariant?.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy" // Tối ưu hiệu năng
        />
        
        {/* Badge MỚI */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
           <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">MỚI</span>
        </div>

        {/* Nút thêm nhanh (Đã sửa lỗi an toàn) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
           <button 
              type="button" // Quan trọng: type button để tránh submit form nếu card nằm trong form
              onClick={handleQuickAdd} 
              className="w-full bg-white text-black font-bold py-2 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors text-sm"
           >
              Thêm nhanh
           </button>
        </div>
      </div>

      {/* DANH SÁCH MÀU */}
      <div className="flex flex-wrap gap-2 mb-2 px-1">
         {uniqueColors.map((v, idx) => (
             <div 
                key={idx} 
                className={`w-4 h-4 rounded-full border border-gray-300 shadow-sm cursor-pointer hover:scale-125 transition-transform 
                    ${selectedVariant?.color === v.color ? 'ring-1 ring-black ring-offset-1 scale-110' : ''}`} 
                style={{ backgroundColor: getColorCode(v.color) }} 
                title={v.color}
                onClick={(e) => handleColorClick(e, v)}
             ></div>
         ))}
      </div>

      {/* THÔNG TIN */}
      <div className="px-1 flex flex-col flex-1 justify-between">
        <div>
            <h3 className="text-[14px] text-gray-700 font-normal group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                {product.name}
            </h3>
            <div className="text-xs text-gray-400 mb-1">
                {selectedVariant?.color || 'Đang cập nhật'}
            </div>
        </div>
        
        <div className="flex items-center gap-2 mt-auto">
            <span className="font-bold text-black text-[15px]">
                {selectedVariant?.price ? selectedVariant.price.toLocaleString('vi-VN') : '0'}đ
            </span>
            {selectedVariant?.price && (
                <>
                    <span className="text-xs text-gray-400 line-through">
                        {(selectedVariant.price * 1.2).toLocaleString('vi-VN').split(',')[0]}...đ
                    </span>
                    <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 rounded">-20%</span>
                </>
            )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;