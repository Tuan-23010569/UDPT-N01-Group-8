package com.shoptht.orderservice.service;

import org.springframework.stereotype.Service;

import com.shoptht.orderservice.entity.Order;
import com.shoptht.orderservice.entity.OrderItem;
import com.shoptht.orderservice.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // Lấy giỏ hàng hoặc tạo mới
    public Order getCart(Long userId) {
        return orderRepository
                .findByUserIdAndStatus(userId, "CART")
                .orElseGet(() -> {
                    Order order = new Order();
                    order.setUserId(userId);
                    order.setStatus("CART");
                    order.setTotalPrice(0.0);
                    return orderRepository.save(order);
                });
    }

    // Thêm sản phẩm vào giỏ
    public Order addToCart(Long userId, OrderItem newItem) {
        Order order = getCart(userId);

        // kiểm tra sản phẩm đã có chưa
        for (OrderItem item : order.getItems()) {
            if (item.getProductId().equals(newItem.getProductId())) {
                item.setQuantity(item.getQuantity() + newItem.getQuantity());
                return updateTotal(order);
            }
        }

        newItem.setOrder(order);
        order.getItems().add(newItem);

        return updateTotal(order);
    }

    private Order updateTotal(Order order) {
        double total = order.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalPrice(total);
        return orderRepository.save(order);
    }
}
