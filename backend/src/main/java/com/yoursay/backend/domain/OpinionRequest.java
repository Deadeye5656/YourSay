package com.yoursay.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpinionRequest {
    private String email;
    private Integer bill_id;
    private String opinion;
}
