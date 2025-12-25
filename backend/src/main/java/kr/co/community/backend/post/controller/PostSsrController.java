package kr.co.community.backend.post.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dto.CommentDTO;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.dto.PostImageDTO;
import kr.co.community.backend.post.service.PostSsrService;
import kr.co.community.backend.util.DateFormatUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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

        int size = 20;
        Map<String, Object> listResult = postSsrService.getPostList(categoryId, q, sort, page, size);

        int totalPages = (int) listResult.get("totalPages");
        int currentPage = (int) listResult.get("page");

        int window = 5;
        int half = window / 2;

        int startPage = Math.max(1, currentPage - half);
        int endPage = startPage + window - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - window + 1);
        }

        int prevPage = Math.max(1, currentPage - 5);
        int nextPage = Math.min(totalPages, currentPage + 5);

        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategoryId", categoryId);
        model.addAttribute("q", q == null ? "" : q);
        model.addAttribute("sort", sort);

        model.addAttribute("posts", listResult.get("posts"));
        model.addAttribute("page", currentPage);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("total", listResult.get("total"));

        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("prevPage", prevPage);
        model.addAttribute("nextPage", nextPage);

        return "board/boardList";
    }

    /**
     * ✅ 게시글 상세 페이지 (blocksMeta 기반 블록 렌더링)
     */
    @GetMapping("/postDetail/{postId}")
    public String getPostDetail(
            @PathVariable Long postId,
            Model model,
            @RequestAttribute(value = "memberId", required = false) Long memberId,
            @RequestAttribute(value = "isAuthenticated", required = false) Boolean isAuthenticated
    ) {
        try {
            PostDTO post = postSsrService.getPostDetail(postId);

            boolean authenticated = (isAuthenticated != null && isAuthenticated);

            if (memberId != null) {
                boolean isLiked = postSsrService.isPostLiked(postId, memberId);
                boolean isBookmarked = postSsrService.isBookmarked(postId, memberId);

                post.setIsLiked(isLiked);
                post.setIsBookmarked(isBookmarked);
            } else {
                post.setIsLiked(false);
                post.setIsBookmarked(false);
            }

            PostDTO prevPost = postSsrService.getPrevPost(postId, post.getCategoryId());
            PostDTO nextPost = postSsrService.getNextPost(postId, post.getCategoryId());
            List<PostDTO> popularPosts = postSsrService.getViewTopPosts(4);
            List<PostDTO> authorOtherPosts = postSsrService.getAuthorOtherPosts(post.getAuthorId(), postId, 3);
            Map<String, Object> authorStats = postSsrService.getAuthorStats(post.getAuthorId());

            log.info("[SSR] postId={}, blocksMeta={}", postId, post.getBlocksMeta());
            log.info("[SSR] images.size={}", post.getImages() == null ? 0 : post.getImages().size());

            model.addAttribute("isAuthenticated", authenticated);
            model.addAttribute("memberId", memberId);
            model.addAttribute("dateUtil", DateFormatUtil.class);

            model.addAttribute("post", post);
            model.addAttribute("blocks", buildBlocksForView(post)); // ✅ 핵심

            model.addAttribute("prevPost", prevPost);
            model.addAttribute("nextPost", nextPost);
            model.addAttribute("popularPosts", popularPosts);
            model.addAttribute("authorOtherPosts", authorOtherPosts);
            model.addAttribute("authorStats", authorStats);

            return "post/postDetail";

        } catch (Exception e) {
            log.error("postDetail fail. postId={}", postId, e);
            return "redirect:/board";
        }
    }

    /**
     * ✅ blocksMeta 기반으로 "텍스트/이미지" 블록을 순서대로 재구성한다.
     * - text: 그대로
     * - image: (우선) saveName 있으면 그거 사용
     *         없으면 imgId로 post.images에서 찾기
     *         없으면 fileIndex로 post.images[index]에서 찾기
     *
     * ✅ blocksMeta 없으면 fallback: content + images를 순서대로 보여줌(구버전 글)
     */
    private List<Map<String, Object>> buildBlocksForView(PostDTO post) {
        List<Map<String, Object>> result = new ArrayList<>();

        List<PostImageDTO> images = post.getImages() == null ? new ArrayList<>() : post.getImages();

        Map<Long, PostImageDTO> imgMap = new HashMap<>();
        for (PostImageDTO img : images) {
            if (img != null && img.getImgId() != null) {
                imgMap.put(img.getImgId(), img);
            }
        }

        String blocksMeta = post.getBlocksMeta();

        // ✅ blocksMeta 없으면 fallback(구버전): text 1개 + images 전부
        if (blocksMeta == null || blocksMeta.isBlank()) {
            if (post.getContent() != null && !post.getContent().isBlank()) {
                Map<String, Object> t = new HashMap<>();
                t.put("type", "text");
                t.put("text", post.getContent());
                result.add(t);
            }
            // ✅ 구버전: 이미지도 같이
            for (PostImageDTO imgDto : images) {
                if (imgDto == null) continue;
                if (imgDto.getSaveName() == null || imgDto.getSaveName().isBlank()) continue;

                Map<String, Object> img = new HashMap<>();
                img.put("type", "image");
                img.put("saveName", imgDto.getSaveName());
                img.put("origName", imgDto.getOrigName());
                result.add(img);
            }
            return result;
        }

        try {
            ObjectMapper om = new ObjectMapper();
            List<Map<String, Object>> metaList =
                    om.readValue(blocksMeta, new TypeReference<List<Map<String, Object>>>() {});

            for (Map<String, Object> m : metaList) {
                if (m == null) continue;

                String type = String.valueOf(m.get("type"));

                // ✅ TEXT
                if ("text".equals(type)) {
                    String text = m.get("text") == null ? "" : m.get("text").toString();
                    if (text.trim().isEmpty()) continue;

                    Map<String, Object> t = new HashMap<>();
                    t.put("type", "text");
                    t.put("text", text);
                    result.add(t);
                    continue;
                }

                // ✅ IMAGE
                if ("image".equals(type)) {
                    String saveName = m.get("saveName") == null ? "" : m.get("saveName").toString();
                    String origName = m.get("origName") == null ? "" : m.get("origName").toString();

                    // 1) saveName
                    if (saveName != null && !saveName.isBlank()) {
                        Map<String, Object> img = new HashMap<>();
                        img.put("type", "image");
                        img.put("saveName", saveName);
                        img.put("origName", origName);
                        result.add(img);
                        continue;
                    }

                    // 2) imgId
                    if (m.get("imgId") != null) {
                        Long imgId = Long.valueOf(m.get("imgId").toString());
                        PostImageDTO imgDto = imgMap.get(imgId);
                        if (imgDto != null && imgDto.getSaveName() != null && !imgDto.getSaveName().isBlank()) {
                            Map<String, Object> img = new HashMap<>();
                            img.put("type", "image");
                            img.put("saveName", imgDto.getSaveName());
                            img.put("origName", (origName == null || origName.isBlank()) ? imgDto.getOrigName() : origName);
                            result.add(img);
                            continue;
                        }
                    }

                    // 3) fileIndex
                    if (m.get("fileIndex") != null) {
                        int fileIndex = Integer.parseInt(m.get("fileIndex").toString());
                        if (fileIndex >= 0 && fileIndex < images.size()) {
                            PostImageDTO imgDto = images.get(fileIndex);
                            if (imgDto != null && imgDto.getSaveName() != null && !imgDto.getSaveName().isBlank()) {
                                Map<String, Object> img = new HashMap<>();
                                img.put("type", "image");
                                img.put("saveName", imgDto.getSaveName());
                                img.put("origName", (origName == null || origName.isBlank()) ? imgDto.getOrigName() : origName);
                                result.add(img);
                                continue;
                            }
                        }
                    }

                    log.warn("[SSR] image block skipped. postId={}, meta={}", post.getPostId(), m);
                }
            }

        } catch (Exception e) {
            log.warn("blocksMeta parse fail. postId={}, blocksMeta={}", post.getPostId(), blocksMeta, e);

            // fallback: content + images
            if (post.getContent() != null && !post.getContent().isBlank()) {
                Map<String, Object> t = new HashMap<>();
                t.put("type", "text");
                t.put("text", post.getContent());
                result.add(t);
            }
            for (PostImageDTO imgDto : images) {
                if (imgDto == null) continue;
                if (imgDto.getSaveName() == null || imgDto.getSaveName().isBlank()) continue;

                Map<String, Object> img = new HashMap<>();
                img.put("type", "image");
                img.put("saveName", imgDto.getSaveName());
                img.put("origName", imgDto.getOrigName());
                result.add(img);
            }
        }

        log.info("[SSR] built blocks.size={}, blocks={}", result.size(), result);
        return result;
    }

    /**
     * ✅ 댓글 작성 (SSR - Form Submit)
     */
    @PostMapping("/postDetail/{postId}/comments")
    public String createComment(
            @PathVariable Long postId,
            @RequestParam String content,
            @RequestAttribute(value = "memberId", required = false) Long memberId,
            RedirectAttributes redirectAttributes
    ) {
        try {
            if (memberId == null) {
                redirectAttributes.addFlashAttribute("errorMessage", "로그인이 필요합니다.");
                return "redirect:/app/login";
            }

            if (content == null || content.trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("errorMessage", "댓글 내용을 입력해주세요.");
                return "redirect:/board/postDetail/" + postId;
            }

            CommentDTO commentDTO = new CommentDTO();
            commentDTO.setPostId(postId);
            commentDTO.setAuthorId(memberId);
            commentDTO.setContent(content.trim());

            postSsrService.createComment(commentDTO);
            redirectAttributes.addFlashAttribute("successMessage", "댓글이 작성되었습니다.");

        } catch (Exception e) {
            log.error("createComment fail. postId={}", postId, e);
            redirectAttributes.addFlashAttribute("errorMessage", "댓글 작성 중 오류가 발생했습니다.");
        }

        return "redirect:/board/postDetail/" + postId;
    }

    @PostMapping("/postDetail/{postId}/like")
    @ResponseBody
    public Map<String, Object> toggleLike(
            @PathVariable Long postId,
            @RequestAttribute(value = "memberId", required = false) Long memberId
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (memberId == null) {
                result.put("success", false);
                result.put("message", "로그인이 필요합니다.");
                return result;
            }

            int newLikeCount = postSsrService.toggleLike(postId, memberId);

            result.put("success", true);
            result.put("likeCount", newLikeCount);

        } catch (Exception e) {
            log.error("toggleLike fail. postId={}, memberId={}", postId, memberId, e);
            result.put("success", false);
            result.put("message", "좋아요 처리 중 오류가 발생했습니다.");
        }
        return result;
    }

    @PostMapping("/postDetail/{postId}/bookmark")
    @ResponseBody
    public Map<String, Object> toggleBookmark(
            @PathVariable Long postId,
            @RequestAttribute(value = "memberId", required = false) Long memberId
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (memberId == null) {
                result.put("success", false);
                result.put("message", "로그인이 필요합니다.");
                return result;
            }

            boolean isBookmarked = postSsrService.toggleBookmark(postId, memberId);

            result.put("success", true);
            result.put("isBookmarked", isBookmarked);
            result.put("message", isBookmarked ? "북마크에 추가되었습니다." : "북마크가 해제되었습니다.");

        } catch (Exception e) {
            log.error("toggleBookmark fail. postId={}, memberId={}", postId, memberId, e);
            result.put("success", false);
            result.put("message", "북마크 처리 중 오류가 발생했습니다.");
        }
        return result;
    }

    @PostMapping("/delete/{postId}")
    @ResponseBody
    public Map<String, Object> deletePost(
            @PathVariable Long postId,
            @RequestAttribute(value = "memberId", required = false) Long memberId
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (memberId == null) {
                result.put("success", false);
                result.put("message", "로그인이 필요합니다.");
                return result;
            }

            boolean deleted = postSsrService.deletePost(postId, memberId);

            result.put("success", deleted);
            result.put("message", deleted ? "삭제되었습니다." : "삭제 권한이 없습니다.");

        } catch (Exception e) {
            log.error("deletePost fail. postId={}, memberId={}", postId, memberId, e);
            result.put("success", false);
            result.put("message", "삭제 중 오류가 발생했습니다.");
        }
        return result;
    }

    @PostMapping("/postDetail/{postId}/report")
    @ResponseBody
    public Map<String, Object> reportPost(
            @PathVariable Long postId,
            @RequestAttribute(value = "memberId", required = false) Long memberId
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (memberId == null) {
                result.put("success", false);
                result.put("message", "로그인이 필요합니다.");
                return result;
            }

            result.put("success", true);
            result.put("message", "신고가 접수되었습니다.");

        } catch (Exception e) {
            log.error("reportPost fail. postId={}", postId, e);
            result.put("success", false);
            result.put("message", "신고 처리 중 오류가 발생했습니다.");
        }
        return result;
    }
}
