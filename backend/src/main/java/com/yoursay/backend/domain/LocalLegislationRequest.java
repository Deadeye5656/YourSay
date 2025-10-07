package com.yoursay.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocalLegislationRequest {
    private String zipcode;
    private String city;
    private String state;
    private String title;
    private String description;
    private String category;
}
