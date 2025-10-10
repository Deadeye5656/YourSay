package com.yoursay.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String email;
    private String zipcode;
    private String state;
    private String preferences;
    private boolean accessGranted;
    private String refreshToken;
    private String accessToken;
}
