package com.shoptht.orderservice.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
}
