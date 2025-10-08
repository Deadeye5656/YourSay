package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Opinion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpinionsRepository extends JpaRepository<Opinion, Long> {
    List<Opinion> findByEmail(String email);
}