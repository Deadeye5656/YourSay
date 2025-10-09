package com.yoursay.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreferencesRequest {
    private String email;
    private String zipcode;
    private String preferences;
}
