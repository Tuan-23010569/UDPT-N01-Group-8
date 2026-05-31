package com.shoptht.orderservice.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "t_orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderNumber;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id") // Báo cho DB biết dùng cột khóa ngoại thay vì tạo bảng trung gian
    private List<OrderItem> orderItems = new ArrayList<>(); 
    
    private String phone;
    private String customerName;
    private String customerEmail;
    private Double totalAmount;
    
    private String status; // Trạng thái đơn hàng (PENDING, SHIPPING...)
    
    // --- THÊM MỚI CHO THANH TOÁN ---
    private String paymentMethod; // VD: COD, BANKING
    private String paymentStatus; // VD: UNPAID, PAID
    // -------------------------------

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // Giúp Jackson dịch thời gian mượt mà
    private LocalDateTime orderDate = LocalDateTime.now();
}