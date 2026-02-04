import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// THÊM ĐOẠN NÀY: Interceptor để tự động lấy response.data
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu có response.data thì trả về nó, ngược lại trả về response gốc
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export default axiosClient;