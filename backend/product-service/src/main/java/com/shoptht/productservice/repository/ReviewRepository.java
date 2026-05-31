package com.shoptht.productservice.repository;

import com.shoptht.productservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Lấy danh sách đánh giá của 1 sản phẩm, sắp xếp mới nhất lên đầu
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    // Lấy toàn bộ đánh giá cho Admin, sắp xếp mới nhất
    List<Review> findAllByOrderByCreatedAtDesc();
}