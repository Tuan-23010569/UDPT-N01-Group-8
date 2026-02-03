import React from 'react';

const ProductCard = ({ product }) => {
  // Lấy biến thể đầu tiên để hiển thị mặc định
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  
  // Xử lý giá tiền (format VND)
  const price = firstVariant ? firstVariant.price.toLocaleString('vi-VN') : 0;
  
  // Xử lý ảnh (nếu không có ảnh thì dùng ảnh placeholder)
  const image = firstVariant && firstVariant.imageUrl ? firstVariant.imageUrl : 'https://via.placeholder.com/300x400?text=No+Image';

  // Lấy danh sách màu (unique)
  const colors = product.variants ? [...new Set(product.variants.map(v => v.color))] : [];

  return (
    <div className="group cursor-pointer">
      {/* ẢNH SẢN PHẨM */}
      <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4] bg-gray-100">
        <img 
          src={image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badge Giảm giá hoặc New */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
           <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">MỚI</span>
        </div>

        {/* Nút thêm nhanh (Hiện khi hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
           <button className="w-full bg-white text-black font-bold py-2 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors">
              Thêm vào giỏ
           </button>
        </div>
      </div>

      {/* DANH SÁCH MÀU */}
      <div className="flex gap-1 mb-2">
         {colors.map((color, idx) => (
             <div key={idx} className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: getColorCode(color) }} title={color}></div>
         ))}
         {colors.length > 4 && <span className="text-xs text-gray-500">+{colors.length - 4}</span>}
      </div>

      {/* THÔNG TIN */}
      <h3 className="text-sm font-normal text-gray-700 mb-1 hover:text-blue-600 transition-colors line-clamp-2 min-h-[40px]">
        {product.name}
      </h3>
      <div className="flex items-center gap-2">
         <span className="font-bold text-black">{price}đ</span>
         {/* Giả lập giá gốc */}
         <span className="text-xs text-gray-400 line-through">{(firstVariant?.price * 1.2).toLocaleString('vi-VN')}đ</span>
         <span className="text-xs text-red-500 font-bold">-20%</span>
      </div>
    </div>
  );
};

// Hàm phụ trợ map tên màu sang mã màu (Demo đơn giản)
const getColorCode = (name) => {
    const map = {
        'Đen': '#000000', 'Trắng': '#FFFFFF', 'Xanh': '#1e3a8a', 'Đỏ': '#dc2626', 'Xám': '#4b5563', 'Vàng': '#ca8a04'
    };
    return map[name] || '#cccccc'; // Mặc định xám nếu không tìm thấy
}

export default ProductCard;