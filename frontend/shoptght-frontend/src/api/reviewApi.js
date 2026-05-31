import axiosClient from './axiosClient';

const reviewApi = {
  // Lấy danh sách đánh giá theo ID sản phẩm
  getByProductId: (productId) => {
    return axiosClient.get(`/products/reviews/product/${productId}`);
  },

  // Thêm đánh giá mới
  addReview: (data) => {
    return axiosClient.post('/products/reviews', data);
  },

  // --- DÀNH CHO ADMIN ---
  // Lấy toàn bộ bình luận
  getAllAdmin: () => {
    return axiosClient.get('/products/reviews/admin/all');
  },

  // Xóa bình luận
  deleteReview: (id) => {
    return axiosClient.delete(`/products/reviews/admin/${id}`);
  }
};

export default reviewApi;