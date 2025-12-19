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
    
    
}
