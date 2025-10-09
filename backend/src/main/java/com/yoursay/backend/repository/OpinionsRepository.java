package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Opinion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OpinionsRepository extends JpaRepository<Opinion, Long> {
    List<Opinion> findByEmail(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM Opinion o WHERE o.email = :email AND o.bill_id = :bill_id")
    void deleteByEmailAndBillId(String email, Integer bill_id);
}