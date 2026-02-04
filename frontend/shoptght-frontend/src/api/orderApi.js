import axiosClient from './axiosClient';

const orderApi = {
  // --- USER (KHÁCH HÀNG) ---

  // 1. Gửi thông tin đặt hàng 
  placeOrder(data) {
    return axiosClient.post('/orders/place', data);
  },

  // 2. Tải hóa đơn PDF 
  getInvoice(id) {
    return axiosClient.get(`/orders/invoice/${id}`, {
      responseType: 'blob' 
    });
  },

  // 3. Lấy lịch sử đơn hàng của tôi (MỚI THÊM)
  // Gọi API: /orders/history?email=...
  getMyOrders(email) {
    return axiosClient.get('/orders/history', {
        params: { email: email }
    });
  },

  // --- ADMIN (QUẢN TRỊ VIÊN) ---

  // 4. Lấy danh sách toàn bộ đơn hàng
  getAll() {
    return axiosClient.get('/orders/admin/all');
  },

  // 5. Cập nhật trạng thái đơn hàng
  updateStatus(id, status) {
    return axiosClient.put(`/orders/${id}/status`, null, {
        params: { status }
    });
  },

  // 6. Cập nhật trạng thái thanh toán
  updatePaymentStatus(id, status) {
    return axiosClient.put(`/orders/${id}/payment-status`, null, {
        params: { status }
    });
  },

  // 7. Thống kê doanh thu
  getStats() {
    return axiosClient.get('/orders/admin/stats');
  }
};

export default orderApi;