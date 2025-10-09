package com.yoursay.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiRequest {
    private String state;
    private String title;
    private String bill_id;
}
