package com.yoursay.backend.controller;

import com.yoursay.backend.domain.LoginRequest;
import com.yoursay.backend.domain.UserRequest;
import com.yoursay.backend.domain.VerificationRequest;
import com.yoursay.backend.service.EmailSenderService;
import com.yoursay.backend.service.FetchLegislationService;
import com.yoursay.backend.service.LoginService;
import com.yoursay.backend.service.SignUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class LegislationController {
    private final SignUpService signUpService;
    private final LoginService loginService;
    private final EmailSenderService emailService;
    private final FetchLegislationService fetchLegislationService;

    @Autowired
    public LegislationController(SignUpService signUpService, LoginService loginService, EmailSenderService emailService, FetchLegislationService fetchLegislationService) {
        this.signUpService = signUpService;
        this.loginService = loginService;
        this.emailService = emailService;
        this.fetchLegislationService = fetchLegislationService;
    }

    // 1. Daily legislation data fetch
    @GetMapping("/legislation/daily-fetch")
    public ResponseEntity<String> fetchDailyLegislation() {
        fetchLegislationService.fetchMasterList();
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
    public ResponseEntity<Boolean> checkLogin(@RequestBody LoginRequest request) {
        boolean isCorrectPassword = loginService.checkPassword(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(isCorrectPassword);
    }

    // 5. Update zipcode and preferences
    @PutMapping("/users/{userId}/preferences")
    public ResponseEntity<String> updatePreferences(@PathVariable String userId, @RequestBody Map<String, Object> preferences) {
        // Placeholder logic
        return ResponseEntity.ok("Preferences updated.");
    }

    // 6. Fetch local legislation
    @GetMapping("/legislation/local")
    public ResponseEntity<String> fetchLocalLegislation(@RequestParam String zipcode) {
        // Placeholder logic
        return ResponseEntity.ok("Local legislation fetched for zipcode: " + zipcode);
    }

    // 7. Fetch state legislation
    @GetMapping("/legislation/state")
    public ResponseEntity<String> fetchStateLegislation(@RequestParam String state) {
        // Placeholder logic
        return ResponseEntity.ok("State legislation fetched for state: " + state);
    }

    // 8. Fetch federal legislation
    @GetMapping("/legislation/federal")
    public ResponseEntity<String> fetchFederalLegislation() {
        // Placeholder logic
        return ResponseEntity.ok("Federal legislation fetched.");
    }

    // 9. Fetch random legislation
    @GetMapping("/legislation/random")
    public ResponseEntity<String> fetchRandomLegislation() {
        // Placeholder logic
        return ResponseEntity.ok("Random legislation fetched.");
    }
}
