package com.shoptht.orderservice.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoptht.orderservice.entity.Order;
import com.shoptht.orderservice.entity.OrderItem;
import com.shoptht.orderservice.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/cart/{userId}")
    public Order getCart(@PathVariable Long userId) {
        return orderService.getCart(userId);
    }

    @PostMapping("/cart/{userId}/add")
    public Order addToCart(
            @PathVariable Long userId,
            @RequestBody OrderItem item
    ) {
        return orderService.addToCart(userId, item);
    }
}
