import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import productApi from '../api/productApi';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get('cat') || "Tất cả sản phẩm";

  // --- STATE LƯU TRỮ BỘ LỌC ---
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    color: null,
    size: null,
    categoryId: null 
  });

  // Hàm nhận dữ liệu từ Sidebar gửi lên
  const handleFilterChange = (newFilters) => {
    console.log("Đang lọc với:", newFilters); // Debug xem log
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        
        // Kiểm tra: Nếu có bất kỳ điều kiện lọc nào -> Gọi API Filter
        // Ngược lại -> Gọi API GetAll
        const hasFilter = filters.minPrice || filters.maxPrice || filters.color || filters.size;

        if (hasFilter) {
            response = await productApi.filter(filters);
        } else {
            response = await productApi.getAll();
        }
        
        // Xử lý kết quả trả về an toàn
        let realData = [];
        if (Array.isArray(response)) {
            realData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
            realData = response.data;
        }
        setProducts(realData);

      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]); // <--- CHẠY LẠI MỖI KHI FILTERS THAY ĐỔI

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
         <div className="text-sm text-gray-500 mb-2">Trang chủ / <span className="text-black font-bold">Sản phẩm</span></div>
         <h1 className="text-3xl font-black uppercase">{categoryName}</h1>
      </div>

      <div className="container mx-auto px-4">
         <div className="flex flex-col lg:flex-row gap-8">
            
            {/* CỘT TRÁI: Truyền hàm handleFilterChange xuống Sidebar */}
            <aside className="hidden lg:block w-1/4 sticky top-24 h-fit">
               <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>

            {/* CỘT PHẢI */}
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
                             onClick={() => window.location.reload()} 
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