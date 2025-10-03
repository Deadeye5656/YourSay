package com.yoursay.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "legislation")
@Getter
@Setter
public class Legislation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer bill_id;
    private String title;
    private String description;
    private String level;
    private String state;
    private String zipcode;
    private String date;
}
