package com.example.demo.User.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private long id;
    private String loginId;
    private String token;
}
