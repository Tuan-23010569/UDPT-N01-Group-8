package com.shoptht.gateway.filter;

import java.util.List;
import java.util.function.Predicate;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class RouteValidator {

    // Danh sách các API cho phép truy cập không cần Token
    public static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/token",
            "/auth/validate",
            "/eureka",
            "/products",    
            "/products/search",    
            "/products/filter",
            "/api/orders/place",
            "/api/orders/invoice"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}