package com.example.demo.Board.repository;

import com.example.demo.Board.modal.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface BoardRepository extends JpaRepository<Board, Long> {

    // 조회수를 DB에서 직접 +1 (동시에 여러 명이 봐도 값이 꼬이지 않음)
    @Modifying(clearAutomatically = true)
    @Query("update Board b set b.view_count = b.view_count + 1 where b.id = :id")
    int increaseViewCount(@Param("id") Long id);
}
