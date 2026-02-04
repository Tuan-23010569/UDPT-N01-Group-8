package com.shoptht.productservice.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class AuthenticationFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        // Chỉ đơn giản là log xem request đến từ đâu, không chặn gì cả
        // Vì Gateway đã chặn ở ngoài rồi.
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        log.info("Request tới Product Service: {}", httpRequest.getRequestURI());
        
        chain.doFilter(request, response);
    }
}