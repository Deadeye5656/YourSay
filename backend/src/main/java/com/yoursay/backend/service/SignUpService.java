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
        user.setState(userRequest.getState());
        user.setPreferences(userRequest.getPreferences());
        userRepository.save(user);
    }

    @Transactional
    public void addVerificationCode(String email, Integer code) {
        verificationRepository.deleteByEmail(email);
        Verification verification = new Verification();
        verification.setCode(code);
        verification.setEmail(email);
        verificationRepository.save(verification);
    }

    public boolean checkVerificationCode(String email, Integer code) {
        Verification verification = verificationRepository.findByEmail(email);
        return verification != null && verification.getCode().equals(code);
    }
}
