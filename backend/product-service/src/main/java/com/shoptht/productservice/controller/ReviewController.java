package com.shoptht.productservice.controller;

import com.shoptht.productservice.entity.Review;
import com.shoptht.productservice.repository.ReviewRepository;
import com.shoptht.productservice.dto.ReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/products/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;

    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProduct(@PathVariable Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @PostMapping
    public Review addReview(@RequestBody ReviewRequest request) {
        Review review = Review.builder()
                .productId(request.getProductId())
                .user(request.getUser())
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();
        return reviewRepository.save(review);
    }

    // --- API DÀNH CHO ADMIN ---
    @GetMapping("/admin/all")
    public List<Review> getAllReviewsAdmin() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    @DeleteMapping("/admin/{id}")
    public String deleteReviewAdmin(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return "Đã xóa bình luận thành công";
    }
}