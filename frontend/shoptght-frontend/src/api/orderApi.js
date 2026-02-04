import axiosClient from './axiosClient';

const orderApi = {
  // 1. Gửi thông tin đặt hàng (User)
  placeOrder(data) {
    return axiosClient.post('/orders/place', data);
  },

  // 2. Tải hóa đơn PDF (User/Admin)
  getInvoice(id) {
    return axiosClient.get(`/orders/invoice/${id}`, {
      responseType: 'blob' 
    });
  },

  // --- PHẦN MỚI THÊM CHO ADMIN ---

  // 3. Lấy danh sách toàn bộ đơn hàng (Admin)
  getAll() {
    return axiosClient.get('/orders/admin/all');
  },

  // 4. Cập nhật trạng thái đơn hàng (Admin)
  updateStatus(id, status) {
    // Backend yêu cầu status truyền qua params (?status=...)
    return axiosClient.put(`/orders/${id}/status`, null, {
        params: { status }
    });
  }
};

export default orderApi;