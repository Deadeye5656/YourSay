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
public class PreferencesService {
    private final UserRepository userRepository;

    @Autowired
    public PreferencesService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public boolean updateUser(String email, String zipcode, String preferences) {
        try{
            if (preferences != null) {
                userRepository.updatePreferences(email, preferences);
            }
            if (zipcode != null) {
                userRepository.updateZip(email, zipcode);
            }
            return false;
        } catch (Exception e) {
            return true;
        }
    }
}
