package com.yoursay.backend.service;

import com.yoursay.backend.domain.*;
import com.yoursay.backend.repository.OpinionsRepository;
import com.yoursay.backend.repository.VotingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OpinionVoteService {
    private final VotingRepository votingRepository;
    private final OpinionsRepository opinionsRepository;

    public OpinionVoteService(VotingRepository votingRepository, OpinionsRepository opinionsRepository) {
        this.votingRepository = votingRepository;
        this.opinionsRepository = opinionsRepository;
    }

    public boolean addOpinionFromRequest(OpinionRequest opinionRequest) {
        try {
            Opinion opinion = new Opinion();
            opinion.setEmail(opinionRequest.getEmail());
            opinion.setOpinion(opinionRequest.getOpinion());
            opinion.setBill_id(opinionRequest.getBill_id());
            opinionsRepository.save(opinion);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean addVoteFromRequest(VoteRequest voteRequest) {
        try{
            Vote vote = new Vote();
            vote.setEmail(voteRequest.getEmail());
            vote.setVote(voteRequest.getVote());
            vote.setBill_id(voteRequest.getBill_id());
            votingRepository.save(vote);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<Opinion> getOpinions(String email) {
        return opinionsRepository.findByEmail(email);
    }

    public List<Vote> getVotes(String email) {
        return votingRepository.findByEmail(email);
    }
}
