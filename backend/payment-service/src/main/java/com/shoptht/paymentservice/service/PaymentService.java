package com.shoptht.paymentservice.service;

import com.shoptht.paymentservice.dto.PaymentRequest;
import com.shoptht.paymentservice.entity.Payment;

public interface PaymentService {
    Payment pay(PaymentRequest request);
}
