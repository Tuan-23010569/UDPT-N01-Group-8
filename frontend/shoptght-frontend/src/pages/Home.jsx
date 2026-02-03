import React, { useEffect, useState } from 'react';
import productApi from '../api/productApi';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productApi.getAll();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[500px] bg-gray-200 overflow-hidden">
         <img 
            src="https://media.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/img/hero/2024/tet-2024-hero-banner-pc.jpg" 
            alt="Banner" 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 flex items-center container mx-auto px-4">
             <div className="max-w-xl text-white drop-shadow-lg pl-8">
                 <h2 className="text-5xl font-black mb-4 uppercase">Coolmate Active</h2>
                 <p className="text-lg mb-6 font-medium">Bộ sưu tập thể thao mới nhất dành cho nam giới. Thoáng mát, co giãn, vận động đỉnh cao.</p>
                 <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-all">
                    KHÁM PHÁ NGAY
                 </button>
             </div>
         </div>
      </section>

      {/* 2. DANH MỤC NỔI BẬT */}
      <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold uppercase mb-6">Danh mục nổi bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Áo Thun', 'Quần Short', 'Sơ Mi', 'Quần Lót'].map((cat, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-[4/5] group cursor-pointer">
                      <img src={`https://source.unsplash.com/random/400x500?men,fashion,${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                      <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                          <span className="text-white font-bold text-xl uppercase">{cat}</span>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* 3. DANH SÁCH SẢN PHẨM MỚI */}
      <section className="bg-gray-50 py-16">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-black uppercase text-gray-900">Sản phẩm mới nhất</h2>
                <a href="#" className="text-blue-600 font-bold hover:underline">Xem tất cả</a>
            </div>

            {loading ? (
                <div className="text-center py-10">Đang tải sản phẩm...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map(p => <ProductCard key={p.id} product={p} />)
                    ) : (
                        <p className="text-gray-500">Chưa có sản phẩm nào.</p>
                    )}
                </div>
            )}
         </div>
      </section>
    </div>
  );
};

export default HomePage;