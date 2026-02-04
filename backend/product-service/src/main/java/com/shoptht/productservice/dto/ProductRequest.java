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
public class ProductRequest {
    private String name;
    private String description;
    
    // Thêm ID danh mục muốn chọn
    private Long categoryId; 

    private List<VariantRequest> variants;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VariantRequest {
        private String color;
        private String size;
        private BigDecimal price;
        private Integer quantity;
        private String imageUrl;
    }
}