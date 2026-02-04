package com.shoptht.orderservice.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoptht.orderservice.dto.OrderRequest;
import com.shoptht.orderservice.service.OrderService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173") // Cấu hình cho phép Frontend gọi API
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 1. API Đặt hàng (POST)
    @PostMapping("/place")
    public String placeOrder(@RequestBody OrderRequest orderRequest) {
        // Trả về ID đơn hàng (ví dụ: "3") để Frontend biết
        return orderService.placeOrder(orderRequest).toString();
    }

    // 2. API Xuất hóa đơn PDF (GET)
    @GetMapping("/invoice/{id}")
    public void generateInvoice(@PathVariable Long id, HttpServletResponse response) throws IOException {
        // Cấu hình Header để trình duyệt hiểu đây là file tải về
        response.setContentType("application/pdf");
        
        // Đặt tên file khi tải về là invoice_ID.pdf
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=invoice_" + id + ".pdf";
        response.setHeader(headerKey, headerValue);

        // Gọi Service để tạo nội dung PDF
        orderService.exportInvoice(id, response);
    }
}