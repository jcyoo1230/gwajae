package com.example.demo.Board.modal;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name="board")
@Getter
@Setter
@NoArgsConstructor

public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String content;


    @Column(nullable = false)
    private String title;

    @Column
    private String create_date;

    @Column
    private int view_count;

    @Builder
    public Board(String author, String title, String content, String create_date, int view_count){
        this.author = author;
        this.title = title;
        this.content = content;
        this.create_date = create_date;
        this.view_count = view_count;
    }

    public void update(String title, String content){
        this.title = title;
        this.content = content;
    }
}
