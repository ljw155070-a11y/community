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
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostSsrService {

    private final PostSsrDao postSsrDao;

    public List<BoardCategoryDTO> getActiveCategories() {
        return postSsrDao.selectActiveCategories();
    }

    public Map<String, Object> getPostList(
            Long categoryId,
            String q,
            String sort,
            int page,
            int size
    ) {
        if (page < 1) page = 1;

        // ✅ sort가 null로 들어오는 케이스 방어(컨트롤러 defaultValue가 있어서 보통 필요 없지만 안전용)
        if (sort == null || sort.isBlank()) sort = "LATEST";

        int total = postSsrDao.countPostList(categoryId, q);

        int offset = (page - 1) * size;
        int startRow = offset + 1;
        int endRow = offset + size;

        // ✅ sort 전달
        List<PostListDTO> posts =
                postSsrDao.selectPostList(categoryId, q, sort, startRow, endRow);

        int totalPages = (int) Math.ceil((double) total / size);

        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts);
        result.put("page", page);
        result.put("totalPages", totalPages);
        result.put("total", total);

        return result;
    }

    @Transactional
    public PostDTO getPostDetail(Long postId) {
        PostDTO post = postSsrDao.selectPostById(postId);

        if (post == null) {
        	throw new IllegalArgumentException("게시글 ID " + postId + "를 찾을 수 없습니다.");
        }

        postSsrDao.updateViewCount(postId);
        post.setViewCount(post.getViewCount() + 1);

        List<CommentDTO> comments = postSsrDao.selectCommentsByPostId(postId);
        post.setComments(comments);

        return post;
    }
    /**
     * ✅ 댓글 작성
     */
    @Transactional
    public void createComment(CommentDTO commentDTO) {
        log.info("댓글 작성: postId={}, authorId={}", commentDTO.getPostId(), commentDTO.getAuthorId());
        
        // 1. 댓글 삽입
        postSsrDao.insertComment(commentDTO);
        
        // 2. 게시글의 댓글 수 증가
        postSsrDao.incrementCommentCount(commentDTO.getPostId());
        
        log.info("댓글 작성 완료: commentId={}", commentDTO.getCommentId());
    }
    public boolean isPostLiked(Long postId, Long memberId) {
        if (memberId == null) return false;
        return postSsrDao.selectPostLikeExists(postId, memberId) > 0;
    }

    @Transactional
    public int toggleLike(Long postId, Long memberId) {
    	log.debug("좋아요 토글: postId={}, memberId={}", postId, memberId);
        
        int likeExists = postSsrDao.selectPostLikeExists(postId, memberId);

        if (likeExists > 0) {
            log.debug("좋아요 취소");
            postSsrDao.deletePostLike(postId, memberId);
            postSsrDao.decrementLikeCount(postId);
        } else {
            log.debug("좋아요 추가");
            postSsrDao.insertPostLike(postId, memberId);
            postSsrDao.incrementLikeCount(postId);
        }

        int newCount = postSsrDao.selectLikeCount(postId);
        log.debug("새 좋아요 수: {}", newCount);
        
        return newCount;
    }

    public boolean isBookmarked(Long postId, Long memberId) {
        if (memberId == null) return false;
        return postSsrDao.selectBookmarkExists(postId, memberId) > 0;
    }

    @Transactional
    public boolean toggleBookmark(Long postId, Long memberId) {
        int bookmarkExists = postSsrDao.selectBookmarkExists(postId, memberId);

        if (bookmarkExists > 0) {
            postSsrDao.deleteBookmark(postId, memberId);
            return false;
        } else {
            postSsrDao.insertBookmark(postId, memberId);
            return true;
        }
    }

    public PostDTO getPrevPost(Long currentPostId, Long categoryId) {
        return postSsrDao.selectPrevPost(currentPostId, categoryId);
    }

    public PostDTO getNextPost(Long currentPostId, Long categoryId) {
        return postSsrDao.selectNextPost(currentPostId, categoryId);
    }

    public List<PostDTO> getViewTopPosts(int limit) {
        return postSsrDao.selectViewTopPosts(limit);
    }

    public List<PostDTO> getAuthorOtherPosts(Long authorId, Long currentPostId, int limit) {
        return postSsrDao.selectAuthorOtherPosts(authorId, currentPostId, limit);
    }

    public Map<String, Object> getAuthorStats(Long authorId) {
        Map<String, Object> stats = new HashMap<>();

        if (authorId == null) {
            stats.put("postCount", 0);
            stats.put("commentCount", 0);
            return stats;
        }

        int postCount = postSsrDao.countAuthorPosts(authorId);
        int commentCount = postSsrDao.countAuthorComments(authorId);

        stats.put("postCount", postCount);
        stats.put("commentCount", commentCount);

        return stats;
    }

    @Transactional
    public boolean deletePost(Long postId, Long memberId) {
    	PostDTO post = postSsrDao.selectPostById(postId);

        if (post == null) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
        }
        
        if (!post.getAuthorId().equals(memberId)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }
        postSsrDao.updateIsDeleted(postId);
        return true;
    }
}
