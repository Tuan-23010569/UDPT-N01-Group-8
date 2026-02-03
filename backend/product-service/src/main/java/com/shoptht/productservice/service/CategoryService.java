package com.shoptht.productservice.service;

import com.shoptht.productservice.entity.Category;
import com.shoptht.productservice.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    // Tạo danh mục mới
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Lấy tất cả danh mục
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}