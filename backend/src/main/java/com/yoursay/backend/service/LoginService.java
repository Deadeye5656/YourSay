package com.yoursay.backend.service;

import com.yoursay.backend.domain.User;
import com.yoursay.backend.domain.UserRequest;
import com.yoursay.backend.domain.Verification;
import com.yoursay.backend.repository.UserRepository;
import com.yoursay.backend.repository.VerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginService {
    private final UserRepository userRepository;

    @Autowired
    public LoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean checkPassword(String email, String password) {
        User user = userRepository.findByEmail(email);
        return user != null && user.getPassword().equals(password);
    }
}
