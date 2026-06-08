import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import productApi from '../api/productApi';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Lấy tham số 'category' từ URL (Lưu ý: Đã khớp với Dropdown ở Header)
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');

  // --- CẤU HÌNH MAPPING: SLUG -> ID ĐÃ ĐỒNG BỘ VỚI FILTERSIDEBAR ---
  const SLUG_TO_ID = {
    'ao-thun': 1,
    'ao-polo': 2,
    'so-mi': 3,
    'ao-tanktop': 4,
    'ao-khoac': 5,
    'quan-short': 6,
    'quan-jeans': 7,
    'quan-jogger': 8,
    'quan-lot': 9,
    'phu-kien': 10
  };

  // Mapping tên hiển thị cho đẹp
  const categoryNames = {
    'ao-thun': 'Áo Thun',
    'ao-polo': 'Áo Polo',
    'so-mi': 'Sơ Mi',
    'ao-tanktop': 'Áo Tanktop',
    'ao-khoac': 'Áo Khoác',
    'quan-short': 'Quần Short',
    'quan-jeans': 'Quần Jeans',
    'quan-jogger': 'Quần Jogger',
    'quan-lot': 'Quần Lót',
    'phu-kien': 'Tất/Vớ & Phụ kiện'
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

          {/* CỘT TRÁI: Sidebar (Đã truyền currentCategoryId để đồng bộ checked) */}
          <aside className="hidden lg:block w-1/4 sticky top-24 h-fit">
            <FilterSidebar
              currentCategoryId={filters.categoryId}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* CỘT PHẢI: List sản phẩm */}
          <main className="w-full lg:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="font-bold text-sm">{products.length} kết quả</span>
                <button className="lg:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-bold w-full justify-center">
                  <SlidersHorizontal size={16} /> Bộ lọc
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm justify-end">
                <span className="text-gray-500">Sắp xếp:</span>
                <div className="font-bold flex items-center cursor-pointer">Mới nhất <ChevronDown size={14} /></div>
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