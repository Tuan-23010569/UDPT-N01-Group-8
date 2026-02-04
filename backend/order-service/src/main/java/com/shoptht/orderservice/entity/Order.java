package com.shoptht.orderservice.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType; // <--- 1. Import thêm cái này
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "t_orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderNumber;
    
    // --- SỬA Ở ĐÂY: Thêm fetch = FetchType.EAGER ---
    // Để khi lấy Order, nó lấy luôn cả danh sách OrderItem đi kèm, tránh lỗi "no Session"
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> orderItems = new ArrayList<>(); 
    
    private String phone;
    
    private String customerName;
    private String customerEmail;
    private Double totalAmount;
    private String status; 
    private LocalDateTime orderDate = LocalDateTime.now();
}