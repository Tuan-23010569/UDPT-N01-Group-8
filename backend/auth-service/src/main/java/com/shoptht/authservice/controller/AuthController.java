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
    public String toggleLockUser(@PathVariable int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Đảo ngược trạng thái khóa (True -> False, False -> True)
        // Giả sử Entity User của bạn có trường 'locked'. 
        // Nếu chưa có, bạn cần thêm private boolean locked; vào entity User
        // user.setLocked(!user.isLocked()); 
        // userRepository.save(user);
        
        // TẠM THỜI COMMENT LẠI NẾU ENTITY USER CHƯA CÓ TRƯỜNG LOCKED
        // ĐỂ TRÁNH LỖI COMPILE KHI BẠN CHẠY
        
        return "Tính năng đang cập nhật (Cần thêm field locked vào Entity User)";
    }
}