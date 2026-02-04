import React, { useEffect, useState } from 'react';
import productApi from '../api/productApi';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm load dữ liệu (Đã sửa để chống lỗi map)
  const fetchProducts = async () => {
    try {
      const data = await productApi.getAll();
      
      // KIỂM TRA QUAN TRỌNG: Chỉ set nếu là mảng
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("API trả về dữ liệu không phải mảng:", data);
        setProducts([]); // Reset về mảng rỗng để không bị lỗi màn hình
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi kết nối Backend!');
      setProducts([]); // Lỗi thì cũng reset về rỗng
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm xóa
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productApi.delete(id);
        toast.success('Xóa thành công!');
        fetchProducts(); // Load lại danh sách
      } catch (error) {
        toast.error('Xóa thất bại!');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách sản phẩm</h2>
        <Link to="/admin/products/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium">
          <Plus size={18} /> Thêm mới
        </Link>
      </div>

      {loading ? (
        <p className="text-center py-4">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Tên sản phẩm</th>
                <th className="p-4 border-b">Danh mục</th>
                <th className="p-4 border-b">Biến thể (Màu/Size)</th>
                <th className="p-4 border-b text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* KIỂM TRA KỸ TRƯỚC KHI MAP */}
              {Array.isArray(products) && products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b font-medium">#{p.id}</td>
                    <td className="p-4 border-b font-bold text-gray-800">{p.name}</td>
                    <td className="p-4 border-b text-blue-600 font-medium">
                        {p.categoryName || 'Chưa phân loại'}
                    </td>
                    <td className="p-4 border-b text-gray-500">
                       <span className="font-bold">{p.variants?.length || 0}</span> loại
                       <div className="text-xs text-gray-400 mt-1">
                          {/* Kiểm tra an toàn cho variants */}
                          {Array.isArray(p.variants) && p.variants.slice(0, 3).map(v => `${v.color}-${v.size}`).join(', ')}
                          {p.variants?.length > 3 && '...'}
                       </div>
                    </td>
                    <td className="p-4 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/admin/products/edit/${p.id}`} className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-500">
                    Chưa có sản phẩm nào. Hãy bấm "Thêm mới".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;