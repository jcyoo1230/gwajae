package com.example.demo.User.service;

import com.example.demo.JWT.JwtProvider;
import com.example.demo.User.dto.LoginRequest;
import com.example.demo.User.dto.LoginResponse;
import com.example.demo.User.dto.UserRequest;
import com.example.demo.User.dto.dupRequest;
import com.example.demo.User.modal.User;
import com.example.demo.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final int MIN_PASSWORD_LENGTH = 8;

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public boolean dup_check(dupRequest req) {
        return userRepo.existsByLoginId(req.getLoginId());
    }

    // 회원가입: 프론트 검증을 우회해도 서버에서 한 번 더 검증
    public void signup(UserRequest req) {
        String loginId = req.getLoginId();
        String password = req.getPassword();
        String email = req.getEmail();

        if (loginId == null || loginId.isBlank() || password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아이디와 비밀번호를 입력해주세요.");
        }
        if (!loginId.equals(loginId.strip()) || loginId.chars().anyMatch(Character::isWhitespace)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아이디에 공백을 포함할 수 없습니다.");
        }
        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호는 " + MIN_PASSWORD_LENGTH + "자 이상이어야 합니다.");
        }
        if (userRepo.existsByLoginId(loginId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 아이디입니다.");
        }

        User user = new User();
        user.setLoginId(loginId);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        userRepo.save(user);
    }

    // 로그인: 성공하면 JWT 발급
    public LoginResponse login(LoginRequest req) {
        User user = userRepo.findByLoginId(req.getLoginId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        String token = jwtProvider.createToken(user.getLoginId());
        return new LoginResponse(user.getId(), user.getLoginId(), token);
    }
}
