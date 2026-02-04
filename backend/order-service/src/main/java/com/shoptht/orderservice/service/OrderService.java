package com.shoptht.orderservice.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.shoptht.orderservice.dto.OrderRequest;
import com.shoptht.orderservice.entity.Order;
import com.shoptht.orderservice.entity.OrderItem;
import com.shoptht.orderservice.repository.OrderRepository;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Hàm 1: Đặt hàng (Place Order)
    @Transactional 
    public Long placeOrder(OrderRequest request) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setStatus("PAID");

        // Chuyển đổi từ DTO sang Entity
        List<OrderItem> items = request.getItems().stream().map(dto -> {
            OrderItem item = new OrderItem();
            item.setProductCode(dto.getProductCode());
            item.setProductName(dto.getProductName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());
            // Đã xóa dòng item.setOrder(order); gây lỗi tại đây
            return item;
        }).collect(Collectors.toList());

        order.setOrderItems(items);
        
        // Tính tổng tiền
        double total = items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);
        return savedOrder.getId();
    }

    // Hàm 2: Xuất hóa đơn PDF
    @Transactional(readOnly = true) 
    public void exportInvoice(Long orderId, HttpServletResponse response) throws IOException {
        // 1. Lấy đơn hàng từ DB
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // 2. Khởi tạo PDF
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        
        // Tạo font chữ
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);

        // 3. Viết nội dung
        Paragraph title = new Paragraph("HOA DON - SHOP THT", fontTitle);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);
        
        document.add(new Paragraph(" ")); 
        document.add(new Paragraph("Ma DH: " + order.getOrderNumber()));
        document.add(new Paragraph("Khach: " + order.getCustomerName()));
        document.add(new Paragraph("Email: " + order.getCustomerEmail()));
        document.add(new Paragraph("--------------------------------"));
        
        // Vòng lặp lấy sản phẩm
        for (OrderItem item : order.getOrderItems()) {
            double subTotal = item.getPrice() * item.getQuantity();
            String line = String.format("- %s (x%d): %.0f VND", item.getProductName(), item.getQuantity(), subTotal);
            document.add(new Paragraph(line));
        }
        
        document.add(new Paragraph("--------------------------------"));
        document.add(new Paragraph("TONG CONG: " + String.format("%.0f", order.getTotalAmount()) + " VND"));
        
        document.close();
    }
}