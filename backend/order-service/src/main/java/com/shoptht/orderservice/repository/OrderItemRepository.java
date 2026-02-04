package com.shoptht.orderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoptht.orderservice.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
