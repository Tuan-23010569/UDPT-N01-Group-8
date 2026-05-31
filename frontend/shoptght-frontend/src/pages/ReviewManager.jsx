import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import reviewApi from '../api/reviewApi';
import { toast } from 'react-toastify';
import { Trash2, Star } from 'lucide-react';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await reviewApi.getAllAdmin();
      const data = response.data || response;
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi tải bình luận:', error);
      toast.error('Không thể tải danh sách bình luận');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
      try {
        await reviewApi.deleteReview(id);
        toast.success('Đã xóa bình luận!');
        // Cập nhật lại danh sách sau khi xóa
        setReviews(reviews.filter((rv) => rv.id !== id));
      } catch (error) {
        toast.error('Lỗi khi xóa bình luận!');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Đang tải danh sách bình luận...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Bình luận</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">ID Sản phẩm</th>
              <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="p-4 font-semibold text-gray-600">Đánh giá</th>
              <th className="p-4 font-semibold text-gray-600">Nội dung</th>
              <th className="p-4 font-semibold text-gray-600">Ngày tạo</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((rv) => (
                <tr key={rv.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">#{rv.id}</td>
                  <td className="p-4 text-sm font-medium">
                    <Link to={`/product/${rv.productId}`} className="text-blue-600 hover:text-blue-800 hover:underline" title="Xem chi tiết sản phẩm" target="_blank" rel="noopener noreferrer">
                      #{rv.productId}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-gray-800">{rv.user}</td>
                  <td className="p-4 text-sm text-gray-600 flex items-center text-yellow-400 gap-1">
                    <Star size={14} fill="currentColor" /> {rv.rating}
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={rv.comment}>{rv.comment}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(rv.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Xóa">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">Không có bình luận nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ReviewManager;