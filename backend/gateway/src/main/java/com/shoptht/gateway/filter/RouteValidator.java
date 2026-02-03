package com.shoptht.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // Danh sách các API cho phép truy cập không cần Token
    public static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/token",
            "/auth/validate",
            "/eureka",
            "/products",           // <--- THÊM DÒNG NÀY (Cho phép xem danh sách)
            "/products/search",    // <--- THÊM DÒNG NÀY (Cho phép tìm kiếm)
            "/products/filter"     // <--- THÊM DÒNG NÀY (Cho phép lọc)
            // Lưu ý: Nếu muốn cho phép POST/PUT/DELETE (Admin) mà không cần token
            // thì thêm "/products" là đủ, nhưng thực tế Admin nên cần Token.
            // Ở giai đoạn dev này, ta tạm mở ra để test.
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}