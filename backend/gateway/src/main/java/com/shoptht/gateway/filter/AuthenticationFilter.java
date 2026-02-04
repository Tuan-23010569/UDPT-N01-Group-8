package com.shoptht.gateway.filter;

import com.shoptht.gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            // 1. Kiểm tra xem đường dẫn này có cần bảo mật không
            if (validator.isSecured.test(exchange.getRequest())) {
                
                // 2. Kiểm tra xem header có chứa Token không
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    throw new RuntimeException("Thiếu authorization header");
                }

                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                
                // Bỏ chữ "Bearer " nếu có để lấy token gốc
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                }

                // 3. Validate Token
                try {
                    jwtUtil.validateToken(authHeader);
                } catch (Exception e) {
                    System.out.println("Lỗi xác thực Token: " + e.getMessage());
                    throw new RuntimeException("Truy cập không hợp lệ (Token sai hoặc hết hạn)");
                }
            }
            return chain.filter(exchange);
        });
    }

    public static class Config {
        // Có thể thêm cấu hình nếu cần
    }
}