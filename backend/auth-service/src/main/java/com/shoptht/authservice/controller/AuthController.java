package com.shoptht.authservice.controller;

import com.shoptht.authservice.dto.LoginRequest;
import com.shoptht.authservice.entity.User;
import com.shoptht.authservice.repository.UserRepository; // <--- Import Repository
import com.shoptht.authservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService service;

    @Autowired
    private UserRepository userRepository; // <--- Cần cái này để lấy thông tin User

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public String addNewUser(@RequestBody User user) {
        return service.saveUser(user);
    }

    // --- 1. SỬA API ĐĂNG NHẬP (Trả về Token + Full thông tin User) ---
    @PostMapping("/token")
    public Map<String, Object> getToken(@RequestBody LoginRequest authRequest) {
        Authentication authenticate = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        
        if (authenticate.isAuthenticated()) {
            // 1. Tạo Token
            String token = service.generateToken(authRequest.getUsername());
            
            // 2. Lấy thông tin User từ Database (để lấy Email, FullName...)
            // Lưu ý: Nếu method trong Repo của bạn là findByUsername thì sửa lại nhé
            User user = userRepository.findByName(authRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 3. Đóng gói kết quả trả về
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user); // Spring tự chuyển User thành JSON
            
            return response;
        } else {
            throw new RuntimeException("invalid access");
        }
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        service.validateToken(token);
        return "Token is valid";
    }

    // --- 2. CÁC API DÀNH CHO ADMIN (QUẢN LÝ KHÁCH HÀNG) ---
    
    // Lấy danh sách tất cả user
    @GetMapping("/users/admin/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Khóa / Mở khóa tài khoản
    @PutMapping("/users/admin/{id}/lock")
    public ResponseEntity<?> toggleLockUser(@PathVariable int id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Đảo ngược trạng thái khóa
            user.setLocked(!user.isLocked());
            userRepository.save(user);

            return ResponseEntity.ok(user.isLocked() ? "Tài khoản đã được khóa." : "Tài khoản đã được mở khóa.");
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra terminal của backend để dễ debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi Server: " + e.getMessage() + " (Vui lòng xem log ở Backend)");
        }
    }
}