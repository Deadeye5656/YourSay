package com.yoursay.backend.controller;

import com.yoursay.backend.domain.*;
import com.yoursay.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class LegislationController {
    private final SignUpService signUpService;
    private final PreferencesService preferencesService;
    private final LoginService loginService;
    private final EmailSenderService emailService;
    private final LegislationImportService legislationImportService;
    private final FetchLegislationService fetchLegislationService;
    private final OpinionVoteService opinionVoteService;

    @Autowired
    public LegislationController(SignUpService signUpService, PreferencesService preferencesService, LoginService loginService, EmailSenderService emailService, LegislationImportService legislationImportService, FetchLegislationService fetchLegislationService, OpinionVoteService opinionVoteService) {
        this.signUpService = signUpService;
        this.preferencesService = preferencesService;
        this.loginService = loginService;
        this.emailService = emailService;
        this.legislationImportService = legislationImportService;
        this.fetchLegislationService = fetchLegislationService;
        this.opinionVoteService = opinionVoteService;
    }

    // 1. Daily legislation data fetch
    @GetMapping("/legislation/daily-fetch")
    public ResponseEntity<String> fetchDailyLegislation() {
        legislationImportService.fetchMasterList();
        return ResponseEntity.ok("Legislation data fetched and updated successfully.");
    }

    // 2. Add new user
    @PostMapping("/users")
    public ResponseEntity<String> verifyAndAddUser(@RequestBody UserRequest user) {
        if (!signUpService.checkVerificationCode(user.getEmail(), user.getVerificationCode())) {
            return ResponseEntity.status(403).body("Invalid verification code.");
        }
        signUpService.addUserFromRequest(user);
        return ResponseEntity.ok("User added.");
    }

    // 3. Send verification text
    @PostMapping("/users/send-verification")
    public ResponseEntity<String> sendVerificationText(@RequestBody VerificationRequest request) {
        Integer randomCode = new Random().nextInt(999999);
        signUpService.addVerificationCode(request.getEmail(), randomCode);
        emailService.emailVerificationCode(request.getEmail(), randomCode);
        return ResponseEntity.ok("Verification text sent.");
    }

    // 4. Check login credentials
    @PostMapping("/users/login")
    public ResponseEntity<LoginResponse> checkLogin(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = loginService.checkPassword(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(loginResponse);
    }

    // 5. Update zipcode and preferences
    @PutMapping("/users/preferences")
    public ResponseEntity<String> updatePreferences(@RequestBody PreferencesRequest preferences) {
        preferencesService.updateUser(preferences.getEmail(), preferences.getZipcode(), preferences.getPreferences());
        return ResponseEntity.ok("Preferences updated.");
    }

    // 6. Fetch local legislation
    @GetMapping("/legislation/local/{zipcode}")
    public ResponseEntity<List<Legislation>> fetchLocalLegislation(@PathVariable String zipcode) {
        List<Legislation> legislationList = fetchLegislationService.fetchLocalLegislation(zipcode);
        return ResponseEntity.ok(legislationList);
    }

    // 7. Fetch state legislation
    @GetMapping("/legislation/state/{state}")
    public ResponseEntity<List<Legislation>> fetchStateLegislation(@PathVariable String state) {
        List<Legislation> legislationList = fetchLegislationService.fetchStateLegislation(state);
        return ResponseEntity.ok(legislationList);
    }

    // 8. Fetch federal legislation
    @GetMapping("/legislation/federal")
    public ResponseEntity<List<Legislation>> fetchFederalLegislation() {
        List<Legislation> legislationList = fetchLegislationService.fetchFederalLegislation();
        return ResponseEntity.ok(legislationList);
    }

    // 9. Fetch random legislation
    @GetMapping("/legislation/random/{zipcode}/{state}")
    public ResponseEntity<List<Legislation>> fetchRandomLegislation(@PathVariable String zipcode, @PathVariable String state) {
        List<Legislation> legislationList = fetchLegislationService.fetchRandomLegislation(zipcode, state);
        return ResponseEntity.ok(legislationList);
    }

    // 10. Add local legislation
    @PostMapping("/legislation/local")
    public ResponseEntity<Boolean> addLocalLegislation(@RequestBody LocalLegislationRequest request) {
        boolean success = legislationImportService.addLocalLegislation(request);
        return ResponseEntity.ok(success);
    }

    // 11. Add vote on bill
    @PostMapping("/legislation/vote")
    public ResponseEntity<Boolean> addVoteOnBill(@RequestBody VoteRequest request) {
        boolean success = opinionVoteService.addVoteFromRequest(request);
        return ResponseEntity.ok(success);
    }

    // 10. Add opinion on bill
    @PostMapping("/legislation/opinion")
    public ResponseEntity<Boolean> addOpinionOnBill(@RequestBody OpinionRequest request) {
        boolean success = opinionVoteService.addOpinionFromRequest(request);
        return ResponseEntity.ok(success);
    }

    // 11. Add vote on bill
    @GetMapping("/legislation/vote/{email}")
    public ResponseEntity<List<Vote>> getVotes(@PathVariable String email) {
        List<Vote> votes = opinionVoteService.getVotes(email);
        return ResponseEntity.ok(votes);
    }

    // 10. Add opinion on bill
    @GetMapping("/legislation/opinion/{email}")
    public ResponseEntity<List<Opinion>> getOpinions(@PathVariable String email) {
        List<Opinion> opinions = opinionVoteService.getOpinions(email);
        return ResponseEntity.ok(opinions);
    }
}
