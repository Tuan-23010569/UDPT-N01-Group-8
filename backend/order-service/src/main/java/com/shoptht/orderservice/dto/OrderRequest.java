package com.shoptht.orderservice.dto;

import java.util.List;
import lombok.Data;

@Data
public class OrderRequest {
    private String customerName;
    private String customerEmail;
    private String phone;
    
    // --- THÊM MỚI ---
    private String paymentMethod; // Frontend gửi lên: "COD" hoặc "BANKING"
    // ----------------
    
    private List<OrderItemDto> items;

    @Data
    public static class OrderItemDto {
        private String productCode;
        private String productName;
        private Double price;
        private Integer quantity;
    }
}