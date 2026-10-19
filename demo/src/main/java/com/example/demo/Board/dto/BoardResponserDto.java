package com.example.demo.Board.dto;

import com.example.demo.Board.modal.Board;
import lombok.Getter;

@Getter
public class BoardResponserDto {
    private String author;
    private String title;
    private String content;
    private String create_date;
    private int view_count;

    public BoardResponserDto(Board entity){
        this.author = entity.getAuthor();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.create_date = entity.getCreate_date();
        this.view_count = entity.getView_count();
    }
}
