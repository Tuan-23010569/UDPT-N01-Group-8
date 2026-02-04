import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productApi from '../api/productApi';
import { toast } from 'react-toastify';
import { ArrowLeft, Plus, Trash, Save } from 'lucide-react';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // 1. State lưu danh sách danh mục để hiển thị Dropdown
  const [categories, setCategories] = useState([]);

  // State quản lý form
  const [product, setProduct] = useState({
    name: '',
    description: '',
    categoryId: '', // Sẽ lưu ID được chọn từ Dropdown
    variants: [
      { color: '', size: '', price: 0, quantity: 10, imageUrl: '' }
    ]
  });

  // Load dữ liệu ban đầu (Danh mục + Sản phẩm nếu Edit)
  useEffect(() => {
    // A. Tải danh sách danh mục
    const loadCategories = async () => {
      try {
        // Gọi hàm gộp trong productApi
        const res = await productApi.getAllCategories();
        // Kiểm tra dữ liệu trả về (mảng hay object bọc data)
        const data = Array.isArray(res) ? res : (res.data || []);
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
        // Không chặn luồng chính, chỉ log lỗi
      }
    };
    loadCategories();

    // B. Tải thông tin sản phẩm (Nếu đang Edit)
    if (isEdit) {
      const loadProduct = async () => {
         try {
             const data = await productApi.getById(id);
             
             // Xử lý lấy ID danh mục từ dữ liệu trả về
             // Backend có thể trả về object category {id: 1, name: '...'} hoặc field categoryId
             const catId = data.category ? data.category.id : (data.categoryId || '');

             setProduct({
                 ...data,
                 categoryId: catId
             });
         } catch (err) {
             toast.error("Không tìm thấy sản phẩm");
         }
      };
      loadProduct();
    }
  }, [id, isEdit]);

  // Xử lý thay đổi input cơ bản
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Xử lý thay đổi trong mảng variants
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = value;
    setProduct({ ...product, variants: newVariants });
  };

  // Thêm dòng biến thể mới
  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { color: '', size: '', price: 0, quantity: 10, imageUrl: '' }]
    });
  };

  // Xóa dòng biến thể
  const removeVariant = (index) => {
    if (product.variants.length === 1) return;
    const newVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: newVariants });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Đảm bảo categoryId là số nguyên (hoặc null)
      const payload = {
          ...product,
          categoryId: product.categoryId ? parseInt(product.categoryId) : null
      };

      if (isEdit) {
        await productApi.update(id, payload);
        toast.success('Cập nhật thành công!');
      } else {
        await productApi.create(payload);
        toast.success('Thêm mới thành công!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra! Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-500 mb-4 hover:text-black">
         <ArrowLeft size={18}/> Quay lại
      </button>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin chung */}
          <div className="grid grid-cols-2 gap-6">
             <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                <input required name="name" value={product.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" placeholder="Ví dụ: Áo thun Coolmate" />
             </div>
             
             {/* --- THAY ĐỔI: DROPDOWN DANH MỤC --- */}
             <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Danh mục</label>
                <select 
                    name="categoryId" 
                    value={product.categoryId} 
                    onChange={handleChange} 
                    required
                    className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none bg-white"
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>Đang tải danh mục...</option>
                    )}
                </select>
             </div>

             <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea name="description" value={product.description} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none h-24" placeholder="Mô tả chi tiết..." />
             </div>
          </div>

          <hr className="border-gray-100"/>

          {/* Quản lý Biến thể */}
          <div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="font-bold text-lg">Biến thể sản phẩm (Màu/Size)</h3>
               <button type="button" onClick={addVariant} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 flex items-center gap-1">
                 <Plus size={14}/> Thêm biến thể
               </button>
            </div>
            
            <div className="space-y-3">
              {product.variants.map((variant, index) => (
                <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded border border-gray-200">
                   <input required placeholder="Màu (Đen)" value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} className="w-24 border p-2 rounded text-sm"/>
                   <input required placeholder="Size (L)" value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} className="w-20 border p-2 rounded text-sm"/>
                   <input required type="number" placeholder="Giá" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="w-32 border p-2 rounded text-sm"/>
                   <input required type="number" placeholder="Số lượng" value={variant.quantity} onChange={e => handleVariantChange(index, 'quantity', e.target.value)} className="w-24 border p-2 rounded text-sm"/>
                   <input placeholder="URL Ảnh" value={variant.imageUrl} onChange={e => handleVariantChange(index, 'imageUrl', e.target.value)} className="flex-1 border p-2 rounded text-sm"/>
                   
                   <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-500 hover:bg-red-100 rounded">
                      <Trash size={16}/>
                   </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex justify-center gap-2">
             <Save size={20}/> {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;