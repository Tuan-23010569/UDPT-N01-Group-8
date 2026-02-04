package com.shoptht.authservice.service;

import com.shoptht.authservice.entity.User;
import com.shoptht.authservice.repository.UserRepository;
import com.shoptht.authservice.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    // Lưu User vào DB (Mã hóa pass)
    public String saveUser(User credential) {
        credential.setPassword(passwordEncoder.encode(credential.getPassword()));
        repository.save(credential);
        return "User added to system";
    }

    // Sinh Token (Gồm Username + Role)
    public String generateToken(String username) {
        // Tìm lại user trong DB để lấy Role
        User user = repository.findByName(username).get();
        return jwtService.generateToken(username, user.getRole());
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }
}