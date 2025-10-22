package com.yoursay.backend.repository;

import com.yoursay.backend.domain.Legislation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LegislationRepository extends JpaRepository<Legislation, Long> {
    List<Legislation> findByZipcodeAndBillLevel(String zipcode, String bill_level);

    List<Legislation> findByStateAndBillLevel(String state, String bill_level);

    @Modifying
    @Query("DELETE FROM Legislation")
    void deleteAllLegislation();
}
