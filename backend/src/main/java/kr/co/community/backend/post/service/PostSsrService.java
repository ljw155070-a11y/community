package kr.co.community.backend.post.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dao.PostSsrDao;
import kr.co.community.backend.post.dto.CommentDTO;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.dto.PostImageDTO;
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

        // ✅ sort null/blank 방어
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

    /**
     * ✅ 게시글 상세 (SSR) - blocksMeta 기반으로 text/image 순서대로 blocks 구성
     * ✅ text는 개행(\n)을 <br/>로 변환해서 SSR에서 줄바꿈 유지
     *
     * ⚠️ 주의: 템플릿에서 text 출력은 th:utext 사용해야 <br/>가 실제 줄바꿈으로 반영됨.
     */
    @Transactional
    public PostDTO getPostDetail(Long postId) {
        PostDTO post = postSsrDao.selectPostById(postId);
        if (post == null) throw new IllegalArgumentException("게시글 없음");

        // 조회수 증가
        postSsrDao.updateViewCount(postId);
        post.setViewCount((post.getViewCount() == null ? 0 : post.getViewCount()) + 1);

        // 댓글
        post.setComments(postSsrDao.selectCommentsByPostId(postId));

        // 이미지 (fileIndex가 이 리스트 순서를 믿음 → 정렬 OK 이미 너 해둠)
        List<PostImageDTO> images = postSsrDao.selectImagesByPostId(postId);
        post.setImages(images);

        // ✅ 여기서 blocksMeta 파싱/변환 하지 마라
        // 컨트롤러 buildBlocksForView()가 fileIndex/imgId/saveName까지 다 처리함

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
 // ✅ 팔로우 여부 확인
    public boolean isFollowing(Long followerId, Long followingId) {
        if (followerId == null || followingId == null) return false;
        return postSsrDao.selectFollowExists(followerId, followingId) > 0;
    }
    
    // ✅ 팔로우 토글
    @Transactional
    public boolean toggleFollow(Long followerId, Long followingId) {
        int exists = postSsrDao.selectFollowExists(followerId, followingId);
        
        if (exists > 0) {
            postSsrDao.deleteFollow(followerId, followingId);
            return false;  // 팔로우 취소
        } else {
            postSsrDao.insertFollow(followerId, followingId);
            return true;   // 팔로우 추가
        }
    }
}
