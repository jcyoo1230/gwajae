package com.example.demo.Board.repository;

import com.example.demo.Board.modal.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface BoardRepository extends JpaRepository<Board, Long> { }
