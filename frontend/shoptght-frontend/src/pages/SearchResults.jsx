import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import productApi from '../api/productApi';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q'); // Lấy từ khóa từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) return;
      
      setLoading(true);
      try {
        const response = await productApi.search(keyword);
        
        // Xử lý dữ liệu trả về an toàn
        let data = [];
        if (Array.isArray(response)) {
             data = response;
        } else if (response && response.data && Array.isArray(response.data)) {
             data = response.data;
        }
        setProducts(data);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]); // Chạy lại khi keyword thay đổi

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header Kết quả */}
        <div className="mb-8">
            <h1 className="text-2xl font-normal text-gray-600">
                Kết quả tìm kiếm cho: <span className="font-black text-black text-3xl">"{keyword}"</span>
            </h1>
            <p className="text-gray-500 mt-2">Tìm thấy <b>{products.length}</b> sản phẩm phù hợp.</p>
        </div>

        {/* Grid Sản phẩm */}
        {loading ? (
            <div className="text-center py-20 text-gray-500">Đang tìm kiếm...</div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <div className="col-span-4 text-center py-16 bg-white rounded-xl shadow-sm">
                        <img src="https://www.coolmate.me/images/no-product.png" className="w-40 mx-auto mb-4 opacity-50" alt="Not found"/>
                        <p className="text-lg text-gray-500">Rất tiếc, không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn.</p>
                        <p className="text-gray-400 text-sm mt-1">Hãy thử tìm với từ khóa chung chung hơn (ví dụ: áo, quần...)</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;