package com.example.demo.User.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest{
    private String loginId;
    private String password;
}
