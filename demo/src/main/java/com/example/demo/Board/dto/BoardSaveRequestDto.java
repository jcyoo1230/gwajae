package com.example.demo.Board.dto;


import com.example.demo.Board.modal.Board;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor
public class BoardSaveRequestDto {
    private String author;
    private String title;
    private String content;
    private String create_date;
    private int view_count;

    public Board toEntity(){
        return Board.builder()
                .author(author)
                .title(title)
                .content(content)
                .create_date(create_date)
                .view_count(view_count)
                .build();
    }
}
