import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';
import reviewApi from '../api/reviewApi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { ArrowLeft, ShoppingCart, Minus, Plus, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // State quản lý lựa chọn của người dùng
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // --- STATE CHO ĐÁNH GIÁ & GỢI Ý ---
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi đổi ID sản phẩm (Click từ Sản phẩm gợi ý)

    const fetchProductInfo = async () => {
      try {
        console.log("Đang gọi API lấy sản phẩm với ID:", id);
        const data = await productApi.getById(id);
        console.log("Dữ liệu API trả về:", data);
        
        // Xử lý trường hợp axios bọc data bên trong 1 object data nữa
        const productData = data.data ? data.data : data;
        setProduct(productData);

        // Khởi tạo màu và size mặc định dựa trên biến thể đầu tiên
        if (productData && productData.variants && productData.variants.length > 0) {
          setSelectedColor(productData.variants[0].color);
          setSelectedSize(productData.variants[0].size);
        }

        // Tải sản phẩm gợi ý (Lấy tất cả sản phẩm & lọc bỏ sản phẩm hiện tại)
        try {
          const fetchFunc = productApi.getAll || productApi.getProducts || productApi.search;
          if (fetchFunc) {
            const suggestData = await fetchFunc();
            const suggestList = suggestData.data ? suggestData.data : suggestData;
            if (Array.isArray(suggestList)) {
              setSuggestedProducts(suggestList.filter(p => p.id?.toString() !== id).slice(0, 4));
            }
          } else {
            console.warn("Không tìm thấy hàm lấy danh sách sản phẩm (như getAll) trong productApi.js");
          }
        } catch (e) {
          console.log("Không tải được sản phẩm gợi ý:", e);
        }
        
        // Tải danh sách đánh giá từ Backend
        try {
          const reviewData = await reviewApi.getByProductId(id);
          setReviews(reviewData.data ? reviewData.data : reviewData);
        } catch (e) {
          console.log("Không tải được đánh giá:", e);
        }
      } catch (error) {
        console.error("LỖI KHI GỌI API GET_BY_ID:", error);
        console.error("Chi tiết lỗi:", error.response || error.message);
        toast.error('Không tìm thấy thông tin sản phẩm!');
        // Tạm thời comment dòng navigate để không bị văng ra ngoài, giúp bạn dễ xem lỗi ở màn hình Console
        // navigate('/collections'); 
      } finally {
        setLoading(false);
      }
    };

    fetchProductInfo();
  }, [id, navigate]);

  // --- LOGIC XỬ LÝ BIẾN THỂ ---
  // 1. Lấy danh sách màu (duy nhất)
  const uniqueColors = [...new Set(product?.variants?.map(v => v.color))].filter(Boolean);

  // 2. Lấy danh sách size (dựa trên màu đang chọn)
  const availableSizes = product?.variants
    ?.filter(v => v.color === selectedColor)
    .map(v => v.size) || [];

  // 3. Tìm biến thể cụ thể khớp với Cả Màu và Size đang chọn để lấy Giá & Hình ảnh
  const selectedVariant = product?.variants?.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  // Khi đổi màu, tự động chọn lại size đầu tiên của màu đó để tránh lỗi
  const handleColorChange = (color) => {
    setSelectedColor(color);
    const sizesForColor = product?.variants?.filter(v => v.color === color).map(v => v.size);
    if (sizesForColor && sizesForColor.length > 0) {
      setSelectedSize(sizesForColor[0]);
    } else {
      setSelectedSize('');
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.warning('Vui lòng chọn đầy đủ màu sắc và kích thước!');
      return;
    }
    addToCart(product, selectedVariant, quantity);
  };

  const handleAddReview = async () => {
    if (!comment.trim()) {
      toast.warning('Vui lòng nhập nội dung đánh giá!');
      return;
    }
    
    try {
      // Lấy thông tin user từ localStorage (nếu đã đăng nhập)
      const storedUser = localStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      const displayName = currentUser ? (currentUser.name || currentUser.fullName) : 'Khách hàng';

      const payload = {
        productId: id,
        user: displayName,
        rating: rating,
        comment: comment
      };
      
      const newRv = await reviewApi.addReview(payload);
      const savedRv = newRv.data ? newRv.data : newRv;
      
      setReviews([savedRv, ...reviews]);
      setComment('');
      setRating(5);
      toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
    } catch (error) {
      toast.error('Lỗi khi gửi đánh giá!');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải chi tiết sản phẩm...</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-6">
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row gap-10">
        
        {/* Cột trái: Ảnh sản phẩm */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src={selectedVariant?.imageUrl || 'https://via.placeholder.com/500x600?text=No+Image'} 
            alt={product.name}
            className="w-full max-w-md rounded-xl object-cover shadow-sm aspect-[3/4]"
          />
        </div>

        {/* Cột phải: Thông tin & Đặt hàng */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-6">Danh mục: {product.category?.name || product.categoryId || 'Đang cập nhật'}</p>
          
          <div className="text-3xl font-black text-blue-600 mb-6 border-b pb-6">
            {selectedVariant?.price ? selectedVariant.price.toLocaleString('vi-VN') : '0'}đ
          </div>

          {/* Chọn Màu sắc */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Màu sắc: <span className="font-normal text-gray-600">{selectedColor}</span></h3>
            <div className="flex gap-3">
              {uniqueColors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorChange(color)}
                  className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                    selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-gray-500 text-gray-700'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Chọn Kích thước */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">Kích thước:</h3>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] px-3 py-2 border rounded-lg font-medium transition-all ${
                    selectedSize === size ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-500 text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng & Nút Thêm vào giỏ */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 text-gray-600"><Minus size={18}/></button>
              <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50 text-gray-600"><Plus size={18}/></button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex justify-center items-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
            >
              <ShoppingCart size={20} /> THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          {/* Mô tả sản phẩm */}
          <div className="mt-4 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-lg mb-3">Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </p>
          </div>
        </div>
      </div>

      {/* --- PHẦN ĐÁNH GIÁ & BÌNH LUẬN --- */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá & Bình luận</h2>
        
        <div className="flex flex-col md:flex-row gap-10">
          {/* Cột trái: Danh sách bình luận */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có đánh giá nào cho sản phẩm này.</p>
            ) : (
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                {reviews.map(rv => (
                  <div key={rv.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 shrink-0">
                        {rv.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{rv.user}</p>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < rv.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">
                        {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm ml-11">{rv.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cột phải: Form viết bình luận */}
          <div className="w-full md:w-1/2 order-1 md:order-2 bg-gray-50 p-6 rounded-xl h-fit">
            <h3 className="font-bold text-gray-800 mb-4">Viết đánh giá của bạn</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-600">Chất lượng:</span>
              <div className="flex cursor-pointer">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={20} 
                    className={star <= rating ? "text-yellow-400" : "text-gray-300"} 
                    fill={star <= rating ? "currentColor" : "none"}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-sm h-24 resize-none"
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
            />
            <button 
              onClick={handleAddReview}
              className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors w-full md:w-auto"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>

      {/* --- PHẦN SẢN PHẨM GỢI Ý --- */}
      {suggestedProducts.length > 0 && (
        <div className="mt-10 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm gợi ý cho bạn</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
