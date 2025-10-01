package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Verification findByEmail(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM Verification v WHERE v.email = :email")
    void deleteByEmail(String email);
}