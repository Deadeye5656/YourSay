package com.yoursay.backend.service;

import com.yoursay.backend.domain.LoginResponse;
import com.yoursay.backend.domain.User;
import com.yoursay.backend.repository.UserRepository;
import com.yoursay.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class LoginService {
    private final UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public LoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse checkPassword(String email, String password) {
        User user = userRepository.findByEmail(email);
        LoginResponse response = new LoginResponse();
        if (user != null && user.getPassword().equals(password)) {
            response.setEmail(user.getEmail());
            response.setZipcode(user.getZipcode());
            response.setState(user.getState());
            // Generate JWT tokens
            String accessToken = jwtUtil.generateToken(user.getEmail());
            String refreshToken = jwtUtil.generateToken(user.getEmail()); // For demo, same as access, but should have longer expiry
            response.setAccessToken(accessToken);
            response.setRefreshToken(refreshToken);
            response.setPreferences(user.getPreferences());
            response.setAccessGranted(true);
        }
        return response;
    }
}
