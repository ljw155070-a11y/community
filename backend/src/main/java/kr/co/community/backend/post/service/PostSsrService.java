package kr.co.community.backend.post.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dao.PostSsrDao;
import kr.co.community.backend.post.dto.CommentDTO;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.dto.PostListDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostSsrService {

    private final PostSsrDao postSsrDao;

    // ✅ 활성 카테고리
    public List<BoardCategoryDTO> getActiveCategories() {
        return postSsrDao.selectActiveCategories();
    }

    // ✅ SSR 게시판 목록
    public Map<String, Object> getPostList(
            Long categoryId,
            String q,
            String sort,
            int page,
            int size
    ) {
        if (page < 1) page = 1;

        int total = postSsrDao.countPostList(categoryId, q);

        int offset = (page - 1) * size;
        int startRow = offset + 1;
        int endRow = offset + size;

        List<PostListDTO> posts =
                postSsrDao.selectPostList(categoryId, q, startRow, endRow);

        int totalPages = (int) Math.ceil((double) total / size);

        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts);      // ✅ 컨트롤러에서 기대하는 이름
        result.put("page", page);
        result.put("totalPages", totalPages);
        result.put("total", total);

        return result;
    }
    /**
     * 게시글 상세 조회 (조회수 증가 포함)
     */
    @Transactional
    public PostDTO getPostDetail(Long postId) {
        // 1. 게시글 조회
        PostDTO post = postSsrDao.selectPostById(postId);
        
        if (post == null) {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
        
        // 2. 조회수 증가
        postSsrDao.updateViewCount(postId);
        post.setViewCount(post.getViewCount() + 1);
        
        // 3. 댓글 조회
        List<CommentDTO> comments = postSsrDao.selectCommentsByPostId(postId);
        post.setComments(comments);
        
        return post;
    }

    /**
     * 게시글 좋아요 여부 확인
     */
    public boolean isPostLiked(Long postId, Long memberId) {
        if (memberId == null) {
            return false;
        }
        return postSsrDao.selectPostLikeExists(postId, memberId) > 0;
    }

    /**
     * 좋아요 토글 (추가/취소)
     */
    @Transactional
    public int toggleLike(Long postId, Long memberId) {
        // 1. 좋아요 여부 확인
        int likeExists = postSsrDao.selectPostLikeExists(postId, memberId);
        
        if (likeExists > 0) {
            // 2-1. 이미 좋아요를 눌렀다면 → 취소
            postSsrDao.deletePostLike(postId, memberId);
            postSsrDao.decrementLikeCount(postId);
        } else {
            // 2-2. 좋아요를 안 눌렀다면 → 추가
            postSsrDao.insertPostLike(postId, memberId);
            postSsrDao.incrementLikeCount(postId);
        }
        
        // 3. 변경된 좋아요 수 반환
        return postSsrDao.selectLikeCount(postId);
    }

    /**
     * 이전 게시글 조회
     */
    public PostDTO getPrevPost(Long currentPostId, Long categoryId) {
        return postSsrDao.selectPrevPost(currentPostId, categoryId);
    }

    /**
     * 다음 게시글 조회
     */
    public PostDTO getNextPost(Long currentPostId, Long categoryId) {
        return postSsrDao.selectNextPost(currentPostId, categoryId);
    }

    /**
     * 인기 게시글 조회 (조회수 기준)
     */
    public List<PostDTO> getPopularPosts(int limit) {
        return postSsrDao.selectPopularPosts(limit);
    }

    /**
     * 게시글 삭제 (작성자 확인 포함)
     */
    @Transactional
    public boolean deletePost(Long postId, Long memberId) {
        // 작성자 확인
        PostDTO post = postSsrDao.selectPostById(postId);
        
        if (post == null || !post.getAuthorId().equals(memberId)) {
            return false;
        }
        
        // 소프트 삭제
        postSsrDao.updateIsDeleted(postId);
        return true;
    }
}
