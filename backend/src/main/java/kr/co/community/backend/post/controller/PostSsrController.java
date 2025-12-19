package kr.co.community.backend.post.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.service.PostSsrService;
import kr.co.community.backend.util.DateFormatUtil;
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
    /**
     * 게시글 상세 페이지
     */
    @GetMapping("/postDetail/{postId}")
    public String getPostDetail(
            @PathVariable Long postId, 
            Model model, 
            HttpSession session
    ) {
        try {
            // 게시글 조회 (조회수 증가 포함)
            PostDTO post = postSsrService.getPostDetail(postId);
            
            System.out.println("postId: " + post.getPostId());
            System.out.println("title: " + post.getTitle());
            System.out.println("likeCount: " + post.getLikeCount());
            System.out.println("viewCount: " + post.getViewCount());
            System.out.println("commentCount: " + post.getCommentCount());
            
            // 로그인한 사용자의 좋아요 여부 확인
            Long memberId = (Long) session.getAttribute("memberId");
            if (memberId != null) {
                boolean isLiked = postSsrService.isPostLiked(postId, memberId);
                post.setIsLiked(isLiked);
            } else {
                post.setIsLiked(false);
            }
            
            // ✅ Date 포맷 유틸리티를 Model에 추가
            model.addAttribute("dateUtil", DateFormatUtil.class);
            model.addAttribute("post", post);
            
            return "post/postDetail";
            
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMessage", "게시글을 불러오는데 실패했습니다.");
            return "error/error";
        }
    }
    //좋아요 토글 API
    @PostMapping("/postDetail/{postId}/like")
    @ResponseBody
    public Map<String, Object> toggleLike(
            @PathVariable Long postId,
            HttpSession session
    ) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Long memberId = (Long) session.getAttribute("memberId");
            
            if (memberId == null) {
                result.put("success", false);
                result.put("message", "로그인이 필요합니다.");
                return result;
            }
            
            // 좋아요 토글
            int newLikeCount = postSsrService.toggleLike(postId, memberId);
            
            result.put("success", true);
            result.put("likeCount", newLikeCount);
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "좋아요 처리 중 오류가 발생했습니다.");
        }
        
        return result;
    }
}
