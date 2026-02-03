package com.shoptht.productservice.service;

import com.shoptht.productservice.dto.ProductRequest;
import com.shoptht.productservice.dto.ProductResponse;
import com.shoptht.productservice.entity.Category;
import com.shoptht.productservice.entity.Product;
import com.shoptht.productservice.entity.ProductVariant;
import com.shoptht.productservice.repository.CategoryRepository;
import com.shoptht.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // 1. Create (Tạo mới)
    @Transactional
    public void createProduct(ProductRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(category)
                .build();

        List<ProductVariant> variants = new ArrayList<>();
        if (request.getVariants() != null) {
            for (ProductRequest.VariantRequest vReq : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .color(vReq.getColor())
                        .size(vReq.getSize())
                        .price(vReq.getPrice())
                        .quantity(vReq.getQuantity())
                        .imageUrl(vReq.getImageUrl())
                        .product(product)
                        .build();
                variants.add(variant);
            }
        }
        product.setVariants(variants);
        productRepository.save(product);
        log.info("Saved product {} with variants", product.getId());
    }

    // 2. Read All (Lấy tất cả)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    // 3. Update (Cập nhật)
    // 3. Update (Cập nhật) - Đã sửa lỗi 500
    @Transactional
    public void updateProduct(Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());

        // Cập nhật Category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        // --- CẬP NHẬT BIẾN THỂ (FIX LỖI 500) ---
        // Cách hoạt động: Xóa hết cái cũ, thêm cái mới vào
        
        // 1. Clear danh sách hiện tại (Nhờ orphanRemoval=true, DB sẽ tự xóa các dòng cũ)
        if (product.getVariants() == null) {
            product.setVariants(new ArrayList<>());
        } else {
            product.getVariants().clear();
        }

        // 2. Thêm danh sách mới vào
        if (request.getVariants() != null) {
            for (ProductRequest.VariantRequest vReq : request.getVariants()) {
                ProductVariant newVariant = ProductVariant.builder()
                        .color(vReq.getColor())
                        .size(vReq.getSize())
                        .price(vReq.getPrice())
                        .quantity(vReq.getQuantity())
                        .imageUrl(vReq.getImageUrl())
                        .product(product) // Quan trọng: Phải set ngược lại Product
                        .build();
                product.getVariants().add(newVariant);
            }
        }
        
        // Lưu
        productRepository.save(product);
    }

    // 4. Delete (Xóa)
    public void deleteProduct(Long productId) {
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
        } else {
            throw new RuntimeException("Product not found");
        }
    }

    // 5. SEARCH (Tìm kiếm)
    public List<ProductResponse> searchProducts(String keyword) {
        List<Product> products = productRepository.searchProducts(keyword);
        return products.stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    // 6. FILTER (Bộ lọc)
    public List<ProductResponse> filterProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String color, String size) {
        List<Product> products = productRepository.filterProducts(categoryId, minPrice, maxPrice, color, size);
        return products.stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    // --- HELPER METHOD QUAN TRỌNG (ĐÃ SỬA LỖI NULL) ---
    private ProductResponse mapToProductResponse(Product product) {
        List<ProductResponse.VariantResponse> variantResponses = new ArrayList<>();
        
        // Kiểm tra an toàn cho Variants
        if (product.getVariants() != null) {
            variantResponses = product.getVariants().stream()
                    .map(v -> ProductResponse.VariantResponse.builder()
                            .id(v.getId())
                            // Nếu color null thì trả về "Mặc định" để không lỗi
                            .color(v.getColor() != null ? v.getColor() : "Mặc định")
                            .size(v.getSize())
                            .price(v.getPrice())
                            .quantity(v.getQuantity())
                            // Nếu ảnh null thì trả về chuỗi rỗng
                            .imageUrl(v.getImageUrl() != null ? v.getImageUrl() : "")
                            .build())
                    .collect(Collectors.toList());
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                // Nếu Category null thì trả về "Khác"
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "Khác")
                .variants(variantResponses)
                .build();
    }
}