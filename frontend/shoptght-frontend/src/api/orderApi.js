import axiosClient from "./axiosClient";

const orderApi = {
    // API đặt hàng
    placeOrder(data) {
        const url = '/orders';
        return axiosClient.post(url, data);
    },

    // Hàm lấy link hóa đơn PDF (dùng link tuyệt đối tới Server Backend)
    getInvoiceUrl(id) {
        // Lưu ý: Thay localhost:8080 thành cổng backend thật của bạn (ví dụ 8083 như trong ảnh lỗi cũ của bạn)
        return `http://localhost:8083/api/orders/invoice/${id}`;
    }
};

export default orderApi; // 👈 Dòng quan trọng nhất để sửa lỗi "missing export default"