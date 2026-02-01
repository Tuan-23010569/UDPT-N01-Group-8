package com.shoptht.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoptht.paymentservice.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
