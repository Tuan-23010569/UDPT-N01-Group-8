package com.shoptht.orderservice.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort; // <--- Import mới để sắp xếp
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

    // --- HÀM 3: ADMIN LẤY TẤT CẢ ĐƠN HÀNG (MỚI THÊM) ---
    public List<Order> getAllOrders() {
        // Sắp xếp theo ngày đặt (orderDate) giảm dần (DESC) -> Đơn mới nhất lên đầu
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate"));
    }

    // --- HÀM 4: ADMIN CẬP NHẬT TRẠNG THÁI (MỚI THÊM) ---
    public void updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));
        
        order.setStatus(newStatus);
        orderRepository.save(order);
    }
}