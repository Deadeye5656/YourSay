package com.yoursay.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    private String password;
    private String email;
    private String phoneNumber;
    private String zipcode;
    private String state;
    private String preferences;
    private Integer verificationCode;
}
