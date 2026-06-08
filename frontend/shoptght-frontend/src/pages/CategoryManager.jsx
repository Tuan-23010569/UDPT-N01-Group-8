import React, { useEffect, useState } from 'react';
import productApi from '../api/productApi';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await productApi.getAllCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Không thể tải danh sách danh mục.');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (category = { id: null, name: '' }) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory({ id: null, name: '' });
    };

    const handleSave = async () => {
        if (!currentCategory.name.trim()) {
            toast.warning('Tên danh mục không được để trống.');
            return;
        }

        try {
            if (currentCategory.id) {
                // Update
                await productApi.updateCategory(currentCategory.id, { name: currentCategory.name });
                toast.success('Cập nhật danh mục thành công!');
            } else {
                // Create
                await productApi.createCategory({ name: currentCategory.name });
                toast.success('Thêm danh mục mới thành công!');
            }
            fetchCategories();
            closeModal();
        } catch (error) {
            toast.error('Lưu danh mục thất bại.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Việc này có thể ảnh hưởng đến các sản phẩm liên quan.')) {
            try {
                await productApi.deleteCategory(id);
                toast.success('Xóa danh mục thành công!');
                fetchCategories();
            } catch (error) {
                toast.error('Xóa danh mục thất bại.');
            }
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h2>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium">
                    <Plus size={18} /> Thêm mới
                </button>
            </div>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <th className="p-4 border-b">ID</th>
                        <th className="p-4 border-b">Tên Danh mục</th>
                        <th className="p-4 border-b text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50">
                            <td className="p-4 border-b font-medium">#{cat.id}</td>
                            <td className="p-4 border-b font-bold text-gray-800">{cat.name}</td>
                            <td className="p-4 border-b text-center">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => openModal(cat)} className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-4">
                            {currentCategory.id ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
                        </h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                            <input
                                type="text"
                                value={currentCategory.name}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none"
                                placeholder="Ví dụ: Áo Khoác"
                            />
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                                Hủy
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2">
                                <Save size={16} /> Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
