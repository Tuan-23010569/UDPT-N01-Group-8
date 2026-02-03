package com.shoptht.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // 1. Cho phép Frontend (Port 5173) gọi vào
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        
        // 2. Cho phép mọi Method (GET, POST, PUT, DELETE...)
        corsConfig.addAllowedMethod("*");
        
        // 3. Cho phép mọi Header (Authorization, Content-Type...)
        corsConfig.addAllowedHeader("*");
        
        // 4. Cho phép gửi Cookie/Token
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}