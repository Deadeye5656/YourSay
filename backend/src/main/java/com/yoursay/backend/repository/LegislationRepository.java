package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Legislation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LegislationRepository extends JpaRepository<Legislation, Long> {
}

