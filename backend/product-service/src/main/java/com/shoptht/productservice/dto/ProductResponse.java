package com.shoptht.productservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    
    // Trả về tên danh mục cho Frontend hiển thị
    private String categoryName; 
    
    private List<VariantResponse> variants;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VariantResponse {
        private Long id;
        private String color;
        private String size;
        private BigDecimal price;
        private Integer quantity;
        private String imageUrl;
    }
}