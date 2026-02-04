import axiosClient from './axiosClient';

const productApi = {
  // --- PRODUCT API ---
  getAll() {
    return axiosClient.get('/products');
  },
  getById(id) {
    return axiosClient.get(`/products/${id}`);
  },
  create(data) {
    return axiosClient.post('/products', data);
  },
  update(id, data) {
    return axiosClient.put(`/products/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/products/${id}`);
  },
  filter(params) {
    return axiosClient.get('/products/filter', { params });
  },
  search(keyword) {
    return axiosClient.get(`/products/search?keyword=${keyword}`);
  },

  // --- CATEGORY API (GỘP CHUNG VÀO ĐÂY) ---
  getAllCategories() {
    return axiosClient.get('/categories'); // Đảm bảo Backend có API này
  }
};

export default productApi;