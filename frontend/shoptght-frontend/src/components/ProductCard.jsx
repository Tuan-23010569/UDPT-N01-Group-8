import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link để chuyển trang
import { CartContext } from '../context/CartContext'; // 2. Import Context

const ProductCard = ({ product }) => {
  // Lấy hàm thêm giỏ hàng từ Context
  const { addToCart } = useContext(CartContext);

  // --- XỬ LÝ DỮ LIỆU SẢN PHẨM ---
  // Lấy biến thể đầu tiên để hiển thị mặc định
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

  // Lấy giá trị thô (số) để tính toán, và giá hiển thị (chuỗi)
  const rawPrice = firstVariant ? firstVariant.price : 0;
  const displayPrice = rawPrice.toLocaleString('vi-VN');

  // Xử lý ảnh (dùng ảnh placeholder nếu không có ảnh)
  const image = firstVariant && firstVariant.imageUrl ? firstVariant.imageUrl : 'https://via.placeholder.com/300x400?text=No+Image';

  // Lấy danh sách màu
  const colors = product.variants ? [...new Set(product.variants.map(v => v.color))] : [];

  // --- HÀM XỬ LÝ KHI BẤM NÚT THÊM ---
  const handleAddToCart = (e) => {
    e.preventDefault(); // Ngăn không cho nhảy vào trang chi tiết
    e.stopPropagation(); // Ngăn sự kiện nổi bọt

    if (!firstVariant) {
      alert("Sản phẩm này tạm hết hàng!");
      return;
    }

    // Tạo object sản phẩm chuẩn để lưu vào giỏ
    const itemToAdd = {
      id: product.id,             // ID sản phẩm cha
      variantId: firstVariant.id, // ID biến thể
      name: product.name,
      price: rawPrice,            // ⚠️ Quan trọng: Lưu số (rawPrice), không lưu chuỗi
      image: image,
      color: firstVariant.color,
      quantity: 1
    };

    addToCart(itemToAdd);
    // alert("Đã thêm vào giỏ hàng!"); // Bỏ comment nếu muốn hiện thông báo
  };

  return (
    // Dùng thẻ Link bao ngoài để bấm vào ảnh thì sang trang chi tiết
    <Link to={`/products/${product.id}`} className="group cursor-pointer block">

      {/* ẢNH SẢN PHẨM */}
      <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4] bg-gray-100">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badge MỚI */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">MỚI</span>
        </div>

        {/* Nút thêm nhanh (Hiện khi hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart} // 👈 3. Gắn sự kiện click vào đây
            className="w-full bg-white text-black font-bold py-2 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors"
          >
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
        <span className="font-bold text-black">{displayPrice}đ</span>

        {/* Giả lập giá gốc (Fix lỗi NaN) */}
        <span className="text-xs text-gray-400 line-through">
          {rawPrice > 0 ? (rawPrice * 1.2).toLocaleString('vi-VN') : '0'}đ
        </span>
        <span className="text-xs text-red-500 font-bold">-20%</span>
      </div>
    </Link>
  );
};

// Hàm phụ trợ map tên màu sang mã Hex
const getColorCode = (name) => {
  const map = {
    'Đen': '#000000', 'Trắng': '#FFFFFF', 'Xanh': '#1e3a8a', 'Đỏ': '#dc2626', 'Xám': '#4b5563', 'Vàng': '#ca8a04', 'Be': '#f5f5dc', 'Nâu': '#78350f', 'Cam': '#ea580c'
  };
  return map[name] || '#cccccc';
}

export default ProductCard;