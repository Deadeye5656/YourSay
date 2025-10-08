package com.yoursay.backend.repository;

import com.yoursay.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.zipcode = :zipcode WHERE u.email = :email")
    void updateZip(String email, String zipcode);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.preferences = :preferences WHERE u.email = :email")
    void updatePreferences(String email, String preferences);
}