package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VotingRepository extends JpaRepository<Vote, Long> {
    List<Vote> findByEmail(String email);
}