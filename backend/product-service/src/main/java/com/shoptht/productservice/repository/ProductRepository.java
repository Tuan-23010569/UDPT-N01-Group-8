package com.shoptht.productservice.repository;

import com.shoptht.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 1. Tìm kiếm theo từ khóa (Cũ)
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    // 2. BỘ LỌC NÂNG CAO (MỚI)
    // Lọc theo: Category, Khoảng giá, Màu, Size
    // DISTINCT: Để tránh trùng lặp sản phẩm nếu nó có nhiều biến thể thỏa mãn
    @Query("SELECT DISTINCT p FROM Product p " +
           "LEFT JOIN p.variants v " +
           "WHERE (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:minPrice IS NULL OR v.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR v.price <= :maxPrice) " +
           "AND (:color IS NULL OR v.color = :color) " +
           "AND (:size IS NULL OR v.size = :size)")
    List<Product> filterProducts(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("color") String color,
            @Param("size") String size
    );
}