import axiosClient from './axiosClient';

const productApi = {
  // Lấy tất cả
  getAll() {
    return axiosClient.get('/products');
  },
  // Lấy chi tiết 1 cái (để sửa)
  getById(id) {
    return axiosClient.get(`/products/${id}`); // Bạn cần đảm bảo Backend có API này
  },
  // Thêm mới
  create(data) {
    return axiosClient.post('/products', data);
  },
  // Cập nhật
  update(id, data) {
    return axiosClient.put(`/products/${id}`, data);
  },
  // Xóa
  delete(id) {
    return axiosClient.delete(`/products/${id}`);
  },
  filter(params) {
    // params là object chứa: { minPrice, maxPrice, color, size, categoryId }
    return axiosClient.get('/products/filter', { params });
  },
  search(keyword) {
    return axiosClient.get(`/products/search?keyword=${keyword}`);
  }
};

export default productApi;