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
    @Transactional
    public PostDTO getPostDetail(Long postId) {
        PostDTO post = postSsrDao.selectPostById(postId);
        
        if (post == null) {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
        
        postSsrDao.updateViewCount(postId);
        post.setViewCount(post.getViewCount() + 1);
        
        List<CommentDTO> comments = postSsrDao.selectCommentsByPostId(postId);
        post.setComments(comments);
        
        return post;
    }

    public boolean isPostLiked(Long postId, Long memberId) {
        if (memberId == null) {
            return false;
        }
        return postSsrDao.selectPostLikeExists(postId, memberId) > 0;
    }

    @Transactional
    public int toggleLike(Long postId, Long memberId) {
        int likeExists = postSsrDao.selectPostLikeExists(postId, memberId);
        
        if (likeExists > 0) {
            postSsrDao.deletePostLike(postId, memberId);
            postSsrDao.decrementLikeCount(postId);
        } else {
            postSsrDao.insertPostLike(postId, memberId);
            postSsrDao.incrementLikeCount(postId);
        }
        
        return postSsrDao.selectLikeCount(postId);
    }

    /**
     * 북마크 여부 확인
     */
    public boolean isBookmarked(Long postId, Long memberId) {
        if (memberId == null) {
            return false;
        }
        return postSsrDao.selectBookmarkExists(postId, memberId) > 0;
    }

    /**
     * 북마크 토글 (추가/취소)
     */
    @Transactional
    public boolean toggleBookmark(Long postId, Long memberId) {
        int bookmarkExists = postSsrDao.selectBookmarkExists(postId, memberId);
        
        if (bookmarkExists > 0) {
            // 이미 북마크했다면 → 취소
            postSsrDao.deleteBookmark(postId, memberId);
            return false; // 북마크 해제됨
        } else {
            // 북마크 안 했다면 → 추가
            postSsrDao.insertBookmark(postId, memberId);
            return true; // 북마크 추가됨
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
        
        int postCount = postSsrDao.countAuthorPosts(authorId);
        int commentCount = postSsrDao.countAuthorComments(authorId);
        
        stats.put("postCount", postCount);
        stats.put("commentCount", commentCount);
        
        return stats;
    }

    @Transactional
    public boolean deletePost(Long postId, Long memberId) {
        PostDTO post = postSsrDao.selectPostById(postId);
        
        if (post == null || !post.getAuthorId().equals(memberId)) {
            return false;
        }
        
        postSsrDao.updateIsDeleted(postId);
        return true;
    }
}
