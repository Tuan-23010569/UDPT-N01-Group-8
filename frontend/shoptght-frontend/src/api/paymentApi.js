import axiosClient from './axiosClient';

const paymentApi = {
  // Tạo thanh toán (Gửi sang Payment Service)
  createPayment(data) {
    // data bao gồm: { orderId, amount, paymentMethod }
    return axiosClient.post('/payments', data);
  }
};

export default paymentApi;