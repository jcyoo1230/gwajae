package com.example.demo.User.controller;

import com.example.demo.User.dto.LoginRequest;
import com.example.demo.User.dto.LoginResponse;
import com.example.demo.User.dto.UserRequest;
import com.example.demo.User.dto.dupRequest;
import com.example.demo.User.modal.User;
import com.example.demo.User.repository.UserRepository;
import com.example.demo.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;   // userRepo 대신

    @PostMapping("/dupcheck")
    public boolean dup_check(@RequestBody dupRequest req){ return userService.dup_check(req);};

    @PostMapping("/signup")
    public void signup(@RequestBody UserRequest req) {
        userService.signup(req);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return userService.login(req);
    }
}
