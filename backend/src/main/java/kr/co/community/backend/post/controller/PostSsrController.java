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
            // 1. 게시글 조회 (조회수 증가 포함)
            PostDTO post = postSsrService.getPostDetail(postId);
            
            // 2. 로그인한 사용자의 좋아요 여부 확인
            Long memberId = (Long) session.getAttribute("memberId");
            if (memberId != null) {
                boolean isLiked = postSsrService.isPostLiked(postId, memberId);
                post.setIsLiked(isLiked);
            } else {
                post.setIsLiked(false);
            }
            
            // 3. 이전글/다음글 조회
            PostDTO prevPost = postSsrService.getPrevPost(postId, post.getCategoryId());
            PostDTO nextPost = postSsrService.getNextPost(postId, post.getCategoryId());
            
            // 4. 인기 게시글 조회 (조회수 기준 TOP 4)
            List<PostDTO> popularPosts = postSsrService.getViewTopPosts(4);
            
            // 5. 작성자의 다른 글 조회 (현재 글 제외, 최신순 3개)
            List<PostDTO> authorOtherPosts = postSsrService.getAuthorOtherPosts(post.getAuthorId(), postId, 3);
            
            // 6. 작성자 통계 조회 (게시글 수, 댓글 수)
            Map<String, Object> authorStats = postSsrService.getAuthorStats(post.getAuthorId());
            
            // 7. Model에 데이터 추가
            model.addAttribute("dateUtil", DateFormatUtil.class);
            model.addAttribute("post", post);
            model.addAttribute("prevPost", prevPost);
            model.addAttribute("nextPost", nextPost);
            model.addAttribute("popularPosts", popularPosts);
            model.addAttribute("authorOtherPosts", authorOtherPosts);
            model.addAttribute("authorStats", authorStats);
            
            return "post/postDetail";
            
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMessage", "게시글을 불러오는데 실패했습니다.");
            return "error/error";
        }
    }

    /**
     * 좋아요 토글 API
     */
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

    /**
     * 게시글 삭제 API
     */
    @PostMapping("/delete/{postId}")
    @ResponseBody
    public Map<String, Object> deletePost(
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
            
            // 작성자 확인 및 삭제
            boolean deleted = postSsrService.deletePost(postId, memberId);
            
            if (deleted) {
                result.put("success", true);
                result.put("message", "삭제되었습니다.");
            } else {
                result.put("success", false);
                result.put("message", "삭제 권한이 없습니다.");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "삭제 중 오류가 발생했습니다.");
        }
        
        return result;
    }
}
