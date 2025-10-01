package com.yoursay.backend.service;

import com.yoursay.backend.domain.User;
import com.yoursay.backend.domain.UserRequest;
import com.yoursay.backend.domain.Verification;
import com.yoursay.backend.repository.UserRepository;
import com.yoursay.backend.repository.VerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SignUpService {
    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;

    @Autowired
    public SignUpService(UserRepository userRepository, VerificationRepository verificationRepository) {
        this.verificationRepository = verificationRepository;
        this.userRepository = userRepository;
    }

    public void addUserFromRequest(UserRequest userRequest) {
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());
        user.setZipcode(userRequest.getZipcode());
        user.setPreferences(userRequest.getPreferences());
        userRepository.save(user);
    }

    public boolean checkVerificationCode(String email, Integer code) {
        Verification verification = verificationRepository.findByEmail(email);
        return verification != null && verification.getCode().equals(code);
    }
}
