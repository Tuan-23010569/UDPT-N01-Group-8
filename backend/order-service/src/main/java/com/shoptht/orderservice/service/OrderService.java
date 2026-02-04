package com.shoptht.orderservice.service;

import java.io.IOException;
import java.time.LocalDate; 
import java.util.List;
import java.util.Map;       
import java.util.TreeMap;   
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shoptht.orderservice.dto.OrderRequest;
import com.shoptht.orderservice.entity.Order;
import com.shoptht.orderservice.entity.OrderItem;
import com.shoptht.orderservice.repository.OrderRepository;

import jakarta.servlet.http.HttpServletResponse;

@Service
@Transactional 
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PdfService pdfService; 

    // --- HÀM 1: ĐẶT HÀNG ---
    public Long placeOrder(OrderRequest request) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        
        // 1. Gán thông tin khách hàng
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail()); 
        order.setPhone(request.getPhone());
        
        // Mặc định đơn mới là PENDING
        order.setStatus("PENDING"); 

        // --- CẬP NHẬT PHẦN THANH TOÁN ---
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus("UNPAID");
        // --------------------------------

        // 2. Chuyển đổi DTO -> Entity (Items)
        List<OrderItem> items = request.getItems().stream().map(dto -> {
            OrderItem item = new OrderItem();
            item.setProductCode(dto.getProductCode()); 
            item.setProductName(dto.getProductName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());
            return item;
        }).collect(Collectors.toList());

        order.setOrderItems(items);
        
        // 3. Tính tổng tiền
        double total = items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        order.setTotalAmount(total);

        // 4. Lưu vào Database
        Order savedOrder = orderRepository.save(order);
        return savedOrder.getId();
    }

    // --- HÀM 2: XUẤT HÓA ĐƠN PDF ---
    public void exportInvoice(Long orderId, HttpServletResponse response) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));

        pdfService.exportReceipt(response, order);
    }

    // --- HÀM 3: ADMIN LẤY TẤT CẢ ĐƠN HÀNG ---
    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate"));
    }

    // --- HÀM 4: ADMIN CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
    public void updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));
        
        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    // --- HÀM 5: ADMIN CẬP NHẬT TRẠNG THÁI THANH TOÁN ---
    public void updatePaymentStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));
        
        order.setPaymentStatus(status);
        orderRepository.save(order);
    }

    // --- HÀM 6: THỐNG KÊ DOANH THU CHO DASHBOARD ---
    public Map<String, Double> getRevenueStats() {
        List<Order> orders = orderRepository.findAll();
        
        // Dùng TreeMap để tự động sắp xếp key (ngày) tăng dần
        Map<String, Double> stats = new TreeMap<>();

        for (Order order : orders) {
            // Kiểm tra null để tránh lỗi nếu dữ liệu cũ thiếu ngày
            if (order.getOrderDate() != null) {
                // Lấy ngày (yyyy-MM-dd)
                String key = order.getOrderDate().toLocalDate().toString();
                
                // Cộng dồn tiền vào ngày đó
                stats.put(key, stats.getOrDefault(key, 0.0) + order.getTotalAmount());
            }
        }
        
        return stats;
    }

    // --- HÀM 7: LẤY LỊCH SỬ ĐƠN HÀNG THEO EMAIL (MỚI THÊM) ---
    // Hàm này được OrderController gọi để phục vụ chức năng "Đơn hàng của tôi"
    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmailOrderByOrderDateDesc(email);
    }
}