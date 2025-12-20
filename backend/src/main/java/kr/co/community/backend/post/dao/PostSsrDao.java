package kr.co.community.backend.post.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dto.CommentDTO;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.dto.PostListDTO;

@Mapper
public interface PostSsrDao {

    List<BoardCategoryDTO> selectActiveCategories();

    int countPostList(
            @Param("categoryId") Long categoryId,
            @Param("q") String q
    );

    List<PostListDTO> selectPostList(
            @Param("categoryId") Long categoryId,
            @Param("q") String q,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow
    );
    
    /**
     * 게시글 단건 조회 (작성자 정보 포함)
     */
    PostDTO selectPostById(@Param("postId") Long postId);

    /**
     * 조회수 증가
     */
    void updateViewCount(@Param("postId") Long postId);

    /**
     * 게시글의 댓글 목록 조회
     */
    List<CommentDTO> selectCommentsByPostId(@Param("postId") Long postId);

    // ========== 좋아요 관련 ==========
    /**
     * 좋아요 여부 확인
     */
    int selectPostLikeExists(@Param("postId") Long postId, @Param("memberId") Long memberId);

    /**
     * 좋아요 추가
     */
    void insertPostLike(@Param("postId") Long postId, @Param("memberId") Long memberId);

    /**
     * 좋아요 취소
     */
    void deletePostLike(@Param("postId") Long postId, @Param("memberId") Long memberId);

    /**
     * 좋아요 수 증가
     */
    void incrementLikeCount(@Param("postId") Long postId);

    /**
     * 좋아요 수 감소
     */
    void decrementLikeCount(@Param("postId") Long postId);

    /**
     * 현재 좋아요 수 조회
     */
    int selectLikeCount(@Param("postId") Long postId);

    // ========== 이전/다음글 ==========
    /**
     * 이전 게시글 조회
     */
    PostDTO selectPrevPost(@Param("currentPostId") Long currentPostId, @Param("categoryId") Long categoryId);

    /**
     * 다음 게시글 조회
     */
    PostDTO selectNextPost(@Param("currentPostId") Long currentPostId, @Param("categoryId") Long categoryId);

    // ========== 인기 게시글 ==========
    /**
     * 인기 게시글 조회 (조회수 기준 TOP N)
     */
    List<PostDTO> selectViewTopPosts(@Param("limit") int limit);

    // ========== 작성자 관련 ==========
    /**
     * 작성자의 다른 글 조회 (현재 글 제외, 최신순)
     */
    List<PostDTO> selectAuthorOtherPosts(
            @Param("authorId") Long authorId, 
            @Param("currentPostId") Long currentPostId, 
            @Param("limit") int limit
    );

    /**
     * 작성자의 게시글 수 조회
     */
    int countAuthorPosts(@Param("authorId") Long authorId);

    /**
     * 작성자의 댓글 수 조회
     */
    int countAuthorComments(@Param("authorId") Long authorId);

    // ========== 게시글 삭제 ==========
    /**
     * 게시글 삭제 (소프트 삭제)
     */
    void updateIsDeleted(@Param("postId") Long postId);
}
