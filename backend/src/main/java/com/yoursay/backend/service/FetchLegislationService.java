package com.yoursay.backend.service;

import com.yoursay.backend.domain.Legislation;
import com.yoursay.backend.repository.LegislationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FetchLegislationService {

    private final LegislationRepository legislationRepository;

    public FetchLegislationService(LegislationRepository legislationRepository) {
        this.legislationRepository = legislationRepository;
    }

    @Transactional
    public List<Legislation> fetchLocalLegislation(String zipcode) {
        return legislationRepository.findByZipcodeAndLevel(zipcode, "LOCAL");
    }

    @Transactional
    public List<Legislation> fetchStateLegislation(String state) {
        return legislationRepository.findByStateAndLevel(state, "STATE");
    }

    @Transactional
    public List<Legislation> fetchFederalLegislation() {
        return legislationRepository.findByStateAndLevel("US", "FEDERAL");
    }

    @Transactional
    public List<Legislation> fetchRandomLegislation(String zipcode, String state) {
        List<Legislation> localLegislation = legislationRepository.findByZipcodeAndLevel(zipcode, "LOCAL");
        List<Legislation> stateLegislation = legislationRepository.findByStateAndLevel(state, "STATE");
        List<Legislation> federalLegislation = legislationRepository.findByStateAndLevel("US", "FEDERAL");
        List<Legislation> combined = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            if (i < localLegislation.size()){
                combined.add(localLegislation.get(i));
            }
            if (i < stateLegislation.size()){
                combined.add(stateLegislation.get(i));
            }
            if (i < federalLegislation.size()) {
                combined.add(federalLegislation.get(i));
            }
        }
        return combined;
    }
}
