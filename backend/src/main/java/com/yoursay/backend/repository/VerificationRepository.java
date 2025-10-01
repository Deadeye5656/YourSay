package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Verification findByEmail(String email);
}