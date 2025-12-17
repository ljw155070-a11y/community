package kr.co.community.backend.post.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.service.PostSsrService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/board")
public class PostSsrController {

    private final PostSsrService postSsrService;

    @GetMapping("")
    public String boardList(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "sort", required = false, defaultValue = "LATEST") String sort,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            Model model
    ) {

        List<BoardCategoryDTO> categories = postSsrService.getActiveCategories();

        int size = 5;
        Map<String, Object> listResult =
                postSsrService.getPostList(categoryId, q, sort, page, size);

        int totalPages = (int) listResult.get("totalPages");

        // ✅ totalPages가 0일 수도 있으니 방어
        if (totalPages < 1) totalPages = 1;

        // ✅ page도 범위 보정
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        /* ===============================
           ✅ 페이지 번호 5개 + 중앙 정렬
           =============================== */
        int window = 5;
        int startPage = page - 2;          // 현재 페이지가 3번째
        int endPage = startPage + window - 1;

        if (startPage < 1) {
            startPage = 1;
            endPage = Math.min(window, totalPages);
        }
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - window + 1);
        }

        /* ===============================
           ✅ 이전 / 다음 : -5 / +5
           =============================== */
        int prevPage = Math.max(1, page - 5);
        int nextPage = Math.min(totalPages, page + 5);

        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategoryId", categoryId);
        model.addAttribute("q", q == null ? "" : q);
        model.addAttribute("sort", sort);

        model.addAttribute("posts", listResult.get("posts"));
        model.addAttribute("page", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("total", listResult.get("total"));

        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("prevPage", prevPage);
        model.addAttribute("nextPage", nextPage);

        return "board/boardList";
    }
}
