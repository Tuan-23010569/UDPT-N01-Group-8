package com.shoptht.orderservice.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping; // <--- Import mới
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // <--- Import mới
import org.springframework.web.bind.annotation.RestController;

import com.shoptht.orderservice.dto.OrderRequest;
import com.shoptht.orderservice.entity.Order;
import com.shoptht.orderservice.service.OrderService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/orders") 
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 1. API Đặt hàng (POST)
    @PostMapping("/place")
    public String placeOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(orderRequest).toString();
    }

    // 2. API Xuất hóa đơn PDF (GET)
    @GetMapping("/invoice/{id}")
    public void generateInvoice(@PathVariable Long id, HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=invoice_" + id + ".pdf";
        response.setHeader(headerKey, headerValue);
        orderService.exportInvoice(id, response);
    }

    // --- 3. API ADMIN: LẤY TẤT CẢ ĐƠN HÀNG (MỚI THÊM) ---
    // URL: GET http://localhost:8080/orders/admin/all
    @GetMapping("/admin/all")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // --- 4. API ADMIN: CẬP NHẬT TRẠNG THÁI (MỚI THÊM) ---
    // URL: PUT http://localhost:8080/orders/1/status?status=SHIPPING
    @PutMapping("/{id}/status")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
        return "Cập nhật trạng thái thành công!";
    }
}