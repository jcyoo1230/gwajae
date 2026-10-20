package com.example.demo.Board.controller;

import com.example.demo.Board.dto.BoardResponserDto;
import com.example.demo.Board.dto.BoardSaveRequestDto;
import com.example.demo.Board.dto.BoardUpdateRequestDto;
import com.example.demo.Board.modal.Board;
import com.example.demo.Board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
public class BoardController {
    private final BoardService boardService;

    @PostMapping("/posts")
    public void write(@RequestBody BoardSaveRequestDto requestDto, Authentication authentication){
        // 작성자는 요청 본문이 아니라 토큰에서 꺼냄 (남의 이름으로 글쓰기 방지)
        boardService.write(authentication.getName(), requestDto);
    }

    @GetMapping("/posts/list")
    public List<Board> boardList(Model model){
        model.addAttribute("list",boardService.boardList());
        return boardService.boardList();
    }

    @PutMapping("/posts/{id}")
    public void update(@PathVariable Long id, @RequestBody BoardUpdateRequestDto dto, Authentication authentication) {
        boardService.update(id, authentication.getName(), dto);
    }

    @DeleteMapping("/posts/{id}")
    public void delete(@PathVariable Long id, Authentication authentication) {
        boardService.delete(id, authentication.getName());
    }

    @GetMapping("/posts/{id}") //이걸 아마 자세히 보기로 해야 할거 같음
    public BoardResponserDto findById(@PathVariable Long id,
                                      @RequestParam(defaultValue = "false") boolean count){
        return boardService.findById(id, count);
    }

}
