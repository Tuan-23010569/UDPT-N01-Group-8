package com.shoptht.productservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // --- THÊM PHẦN NÀY ---
    // Liên kết: Nhiều sản phẩm thuộc 1 danh mục
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    // ---------------------

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ProductVariant> variants;
}