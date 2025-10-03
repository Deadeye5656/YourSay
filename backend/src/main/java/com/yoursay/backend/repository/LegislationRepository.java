package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Legislation;
import com.yoursay.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LegislationRepository extends JpaRepository<Legislation, Long> {
    List<Legislation> findByZipcodeAndLevel(String zipcode, String level);

    List<Legislation> findByStateAndLevel(String state, String level);
}

