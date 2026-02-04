package com.shoptht.paymentservice.dto;

public class PaymentRequest {

    private Long orderId;
    private String method;

    public Long getOrderId() {
        return orderId;
    }

    public String getMethod() {
        return method;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setMethod(String method) {
        this.method = method;
    }
}
