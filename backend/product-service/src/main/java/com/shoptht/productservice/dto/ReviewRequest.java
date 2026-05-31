package com.shoptht.productservice.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long productId;
    private String user;
    private Integer rating;
    private String comment;
}