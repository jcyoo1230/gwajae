package com.example.demo.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtProvider {

    private final SecretKey key;
    private final long expirationMs;

    public JwtProvider(@Value("${jwt.secret}") String secret,
                       @Value("${jwt.expiration-ms:1800000}") long expirationMs) { // 만료 인증 토큰 30분
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); // secret은 32바이트 이상
        this.expirationMs = expirationMs;
    }

    public String createToken(String loginId) {
        Date now = new Date();
        return Jwts.builder()
                .subject(loginId)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public boolean validate(String token) {
        try {
            parseClaims(token);//Claim으로 토큰에 저장된 정보 꺼내기
            return true;
        } catch (JwtException | IllegalArgumentException e) { // 만료, 위조, 형식 오류
            return false;
        }
    }

    public String getLoginId(String token) {
        return parseClaims(token).getSubject();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
