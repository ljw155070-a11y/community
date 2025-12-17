package kr.co.community.backend.post.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.service.PostSsrService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/board")
public class PostSsrController {

    private final PostSsrService postSsrService;

    // ✅ SSR 게시판 목록 (비로그인)
    @GetMapping("")
    public String boardList(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "sort", required = false, defaultValue = "LATEST") String sort,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            Model model
    ) {

        List<BoardCategoryDTO> categories = postSsrService.getActiveCategories();

        int size = 5; // 화면 카드 기준
        Map<String, Object> listResult = postSsrService.getPostList(categoryId, q, sort, page, size);

        int totalPages = (int) listResult.get("totalPages");
        int currentPage = (int) listResult.get("page");

        // ✅ 페이지네이션: 5개씩 노출 + 현재 페이지가 중앙에 오도록
        int window = 5;
        int half = window / 2; // 3

        int startPage = Math.max(1, currentPage - half);
        int endPage = startPage + window - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - window + 1);
        }

        // ✅ 이전/다음: -5 / +5 점프
        int prevPage = Math.max(1, currentPage - 5);
        int nextPage = Math.min(totalPages, currentPage + 5);

        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategoryId", categoryId); // null이면 전체
        model.addAttribute("q", q == null ? "" : q);
        model.addAttribute("sort", sort);

        model.addAttribute("posts", listResult.get("posts"));
        model.addAttribute("page", currentPage);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("total", listResult.get("total"));

        // ✅ pagination 관련
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("prevPage", prevPage);
        model.addAttribute("nextPage", nextPage);

        return "board/boardList";
    }
    @GetMapping("/postDetail/{postId}")
    public String getPostDetail(@PathVariable Long postId, Model model, HttpSession session) {
        // 더미 데이터
        PostDTO dummyPost = new PostDTO();
        dummyPost.setPostId(postId);
        dummyPost.setTitle("테스트 제목");
        dummyPost.setContent("테스트 내용입니다.");
        dummyPost.setViewCount(100);
        dummyPost.setCommentCount(5);
        dummyPost.setLikeCount(10);
        
        model.addAttribute("post", dummyPost);
        return "post/postDetail";
    }
}
