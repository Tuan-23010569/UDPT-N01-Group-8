import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import productApi from '../api/productApi';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Lấy tham số 'category' từ URL (Lưu ý: Phải khớp với bên HomePage là 'category')
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');

  // --- CẤU HÌNH MAPPING: SLUG -> ID (QUAN TRỌNG: SỬA THEO DB CỦA BẠN) ---
  const SLUG_TO_ID = {
    'ao-thun': 2,      // Thay số 1 bằng ID của Áo Thun trong DB
    'ao-polo': 6,   // Thay số 2 bằng ID của Quần Short trong DB
    'so-mi': 5,        // Thay số 3 bằng ID của Sơ Mi trong DB
    'quan-lot': 4      // Thay số 4 bằng ID của Quần Lót trong DB
  };

  // Mapping tên hiển thị cho đẹp
  const categoryNames = {
    'ao-thun': 'Áo Thun',
    'ao-polo': 'Áo Polo',
    'so-mi': 'Sơ Mi',
    'quan-lot': 'Quần Lót'
  };
  const displayTitle = categorySlug ? (categoryNames[categorySlug] || "Sản phẩm") : "Tất cả sản phẩm";

  // --- STATE LƯU TRỮ BỘ LỌC ---
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    color: null,
    size: null,
    categoryId: null // Backend cần ID này để lọc
  });

  // 2. KHI URL THAY ĐỔI -> CẬP NHẬT FILTER CATEGORY ID
  useEffect(() => {
    if (categorySlug) {
        // Dịch slug sang ID
        const mappedId = SLUG_TO_ID[categorySlug];
        if (mappedId) {
             setFilters(prev => ({ ...prev, categoryId: mappedId }));
        } else {
             console.warn("Không tìm thấy ID cho slug:", categorySlug);
        }
    } else {
        // Nếu không có cate trên URL, reset ID về null
        setFilters(prev => ({ ...prev, categoryId: null }));
    }
  }, [categorySlug]);

  // Hàm nhận dữ liệu từ Sidebar gửi lên
  const handleFilterChange = (newFilters) => {
    console.log("Sidebar gửi lên:", newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 3. FETCH DATA KHI FILTERS THAY ĐỔI
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        
        // Kiểm tra xem có đang lọc không (bao gồm cả categoryId)
        const hasFilter = filters.minPrice || filters.maxPrice || filters.color || filters.size || filters.categoryId;

        if (hasFilter) {
            console.log("Gọi API Filter với:", filters);
            response = await productApi.filter(filters);
        } else {
            console.log("Gọi API getAll");
            response = await productApi.getAll();
        }
        
        // Xử lý kết quả trả về an toàn
        let realData = [];
        if (Array.isArray(response)) {
            realData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
            realData = response.data;
        } else if (response && response.content && Array.isArray(response.content)) {
            realData = response.content; // Trường hợp Spring Pageable
        }
        setProducts(realData);

      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]); // Chạy lại mỗi khi filters thay đổi

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
         <div className="text-sm text-gray-500 mb-2">Trang chủ / <span className="text-black font-bold">Sản phẩm</span></div>
         <h1 className="text-3xl font-black uppercase">{displayTitle}</h1>
      </div>

      <div className="container mx-auto px-4">
         <div className="flex flex-col lg:flex-row gap-8">
            
            {/* CỘT TRÁI: Sidebar */}
            <aside className="hidden lg:block w-1/4 sticky top-24 h-fit">
               <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>

            {/* CỘT PHẢI: List sản phẩm */}
            <main className="w-full lg:w-3/4">
               <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                      <span className="font-bold text-sm">{products.length} kết quả</span>
                      <button className="lg:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-bold w-full justify-center">
                         <SlidersHorizontal size={16}/> Bộ lọc
                      </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm justify-end">
                      <span className="text-gray-500">Sắp xếp:</span>
                      <div className="font-bold flex items-center cursor-pointer">Mới nhất <ChevronDown size={14}/></div>
                  </div>
               </div>

               {loading ? (
                  <div className="text-center py-20">Đang tìm kiếm...</div>
               ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                      {products.length > 0 ? (
                         products.map(p => <ProductCard key={p.id} product={p} />)
                      ) : (
                         <div className="col-span-3 text-center py-20 text-gray-500">
                            <p className="text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                            <button 
                              onClick={() => window.location.href = '/collections'} 
                              className="text-blue-600 font-bold hover:underline mt-2"
                            >
                              Xóa bộ lọc
                            </button>
                         </div>
                      )}
                  </div>
               )}
            </main>
         </div>
      </div>
    </div>
  );
};

export default Collection;