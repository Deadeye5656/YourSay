package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VotingRepository extends JpaRepository<Vote, Long> {
    List<Vote> findByEmail(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM Vote v WHERE v.email = :email AND v.bill_id = :bill_id")
    void deleteByEmailAndBillId(String email, Integer bill_id);
}