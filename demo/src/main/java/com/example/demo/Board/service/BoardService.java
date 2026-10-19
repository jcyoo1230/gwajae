package com.example.demo.Board.service;


import com.example.demo.Board.dto.BoardResponserDto;
import com.example.demo.Board.dto.BoardSaveRequestDto;
import com.example.demo.Board.dto.BoardUpdateRequestDto;
import com.example.demo.Board.modal.Board;
import com.example.demo.Board.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
//여기서 이제 게시판 내용 조회(select) 및 작성(write), 수정(edit), 삭제(drop)를 해야하는데 너무 어렵다...
public class BoardService {
    private final BoardRepository boardRepo;

    @Transactional
    public void write(String author, BoardSaveRequestDto req){
        Board board = new Board();
        board.setAuthor(author);
        board.setTitle(req.getTitle());
        board.setContent(req.getContent());
        board.setCreate_date(req.getCreate_date());
        board.setView_count(req.getView_count());
        boardRepo.save(board);
    }

    @Transactional
    public void update(Long id, String loginId, BoardUpdateRequestDto dto) {
        Board board = boardRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글이 없습니다. id=" + id));
        if (!board.getAuthor().equals(loginId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 글만 수정할 수 있습니다.");
        }
        board.update(dto.getTitle(), dto.getContent());   // 더티 체킹으로 UPDATE 실행
    }

    public BoardResponserDto findById(Long id) {
        Board entity = boardRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + id));
        return new BoardResponserDto(entity);
    }
    public List<Board> boardList() {
        return boardRepo.findAll(); // Board 라는 class가 담긴 List 반환
    }



}
