import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    return axiosClient.post('/auth/token', data);
  },

  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },

  // --- DÀNH CHO ADMIN ---

  // Lấy danh sách tất cả user
  getAllUsers: () => {
    return axiosClient.get('/auth/users/admin/all');
  },

  // Khóa hoặc mở khóa tài khoản
  toggleLock: (userId) => {
    return axiosClient.put(`/auth/users/admin/${userId}/lock`);
  },
};

export default authApi;