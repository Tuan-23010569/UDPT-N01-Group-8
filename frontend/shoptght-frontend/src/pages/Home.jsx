import React, { useEffect, useState } from 'react';
import productApi from '../api/productApi';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom'; 

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Danh sách danh mục (kèm slug để lọc và ảnh minh họa)
  const categories = [
    { 
      name: 'Áo Thun', 
      slug: 'ao-thun', 
      image: 'https://n7media.coolmate.me/uploads/2026/01/13/ao-thun.jpg?aio=w-672' 
    },
    { 
      name: 'Áo Polo', 
      slug: 'ao-polo', 
      image: 'https://n7media.coolmate.me/uploads/2026/01/13/polo.jpg?aio=w-672' 
    },
    { 
      name: 'Sơ Mi', 
      slug: 'so-mi', 
      image: 'https://n7media.coolmate.me/uploads/2026/01/13/so-mi.jpg?aio=w-672' 
    },
    { 
      name: 'Quần Lót', 
      slug: 'quan-lot', 
      image: 'https://n7media.coolmate.me/uploads/2026/01/13/quan-lot.jpg?aio=w-672' 
    }
  ];

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
      {/* 1. HERO BANNER (ĐÃ SỬA) */}
      {/* Đã xóa lớp phủ chữ và bọc ảnh trong Link để click được toàn bộ banner */}
      <section className="relative w-full h-[500px] bg-gray-200 overflow-hidden group">
         <Link to="/collections" className="block w-full h-full">
             <img 
                src="https://n7media.coolmate.me/uploads/2026/01/27/namgn_Frame-87987.jpg" 
                alt="Banner Khuyến Mãi" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
             />
         </Link>
      </section>

      {/* 2. DANH MỤC NỔI BẬT */}
      <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold uppercase mb-6">Danh mục nổi bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, idx) => (
                  <Link 
                    key={idx} 
                    to={`/collections?category=${cat.slug}`} 
                    className="relative rounded-xl overflow-hidden aspect-[4/5] group cursor-pointer block"
                  >
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <span className="text-white font-bold text-xl uppercase">{cat.name}</span>
                      </div>
                  </Link>
              ))}
          </div>
      </section>

      {/* 3. DANH SÁCH SẢN PHẨM MỚI */}
      <section className="bg-gray-50 py-16">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-black uppercase text-gray-900">Sản phẩm mới nhất</h2>
                <Link to="/collections" className="text-blue-600 font-bold hover:underline">Xem tất cả</Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Đang tải sản phẩm...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map(p => <ProductCard key={p.id} product={p} />)
                    ) : (
                        <p className="text-gray-500 col-span-4 text-center">Chưa có sản phẩm nào.</p>
                    )}
                </div>
            )}
         </div>
      </section>
    </div>
  );
};

export default HomePage;