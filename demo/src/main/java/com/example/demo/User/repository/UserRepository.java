package com.example.demo.User.repository;

import com.example.demo.User.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.jdbc.*;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginId(String loginId);

    boolean existsByLoginId(String loginId);
}