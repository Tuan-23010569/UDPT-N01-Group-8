package com.shoptht.productservice.controller;

import com.shoptht.productservice.dto.ProductRequest;
import com.shoptht.productservice.dto.ProductResponse;
import com.shoptht.productservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 1. Tạo sản phẩm
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String createProduct(@RequestBody ProductRequest productRequest) {
        productService.createProduct(productRequest);
        return "Product Created Successfully";
    }

    // 2. Lấy tất cả sản phẩm
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    // 3. Tìm kiếm theo từ khóa (Search)
    // URL: http://localhost:8081/products/search?keyword=abc
    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> searchProducts(@RequestParam("keyword") String keyword) {
        return productService.searchProducts(keyword);
    }

    // 4. BỘ LỌC SẢN PHẨM (MỚI THÊM)
    // URL: http://localhost:8081/products/filter?minPrice=100000&color=Đen
    @GetMapping("/filter")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> filterProducts(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "size", required = false) String size
    ) {
        return productService.filterProducts(categoryId, minPrice, maxPrice, color, size);
    }

    // 5. Cập nhật sản phẩm
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public String updateProduct(@PathVariable("id") Long id, @RequestBody ProductRequest productRequest) {
        productService.updateProduct(id, productRequest);
        return "Product Updated Successfully";
    }

    // 6. Xóa sản phẩm
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public String deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
        return "Product Deleted Successfully";
    }
}