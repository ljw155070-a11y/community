package kr.co.community.backend.post.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dto.CommentDTO;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.dto.PostImageDTO;
import kr.co.community.backend.post.dto.PostListDTO;

@Mapper
public interface PostSsrDao {

    List<BoardCategoryDTO> selectActiveCategories();

    int countPostList(
            @Param("categoryId") Long categoryId,
            @Param("q") String q
    );

    // ✅ sort 파라미터 추가
    List<PostListDTO> selectPostList(
            @Param("categoryId") Long categoryId,
            @Param("q") String q,
            @Param("sort") String sort,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow
    );

    PostDTO selectPostById(@Param("postId") Long postId);

    void updateViewCount(@Param("postId") Long postId);

    List<CommentDTO> selectCommentsByPostId(@Param("postId") Long postId);
    
    List<PostImageDTO> selectImagesByPostId(Long postId);
    
    // ========== 댓글 작성 ==========
    void insertComment(CommentDTO commentDTO);
    
    void incrementCommentCount(@Param("postId") Long postId);
    
    // ========== 좋아요 관련 ==========
    int selectPostLikeExists(@Param("postId") Long postId, @Param("memberId") Long memberId);

    void insertPostLike(@Param("postId") Long postId, @Param("memberId") Long memberId);

    void deletePostLike(@Param("postId") Long postId, @Param("memberId") Long memberId);

    void incrementLikeCount(@Param("postId") Long postId);

    void decrementLikeCount(@Param("postId") Long postId);

    int selectLikeCount(@Param("postId") Long postId);

    // ========== 북마크 관련 ==========
    int selectBookmarkExists(@Param("postId") Long postId, @Param("memberId") Long memberId);

    void insertBookmark(@Param("postId") Long postId, @Param("memberId") Long memberId);

    void deleteBookmark(@Param("postId") Long postId, @Param("memberId") Long memberId);

    // ========== 이전/다음글 ==========
    PostDTO selectPrevPost(@Param("currentPostId") Long currentPostId, @Param("categoryId") Long categoryId);

    PostDTO selectNextPost(@Param("currentPostId") Long currentPostId, @Param("categoryId") Long categoryId);

    // ========== 인기 게시글 ==========
    List<PostDTO> selectViewTopPosts(@Param("limit") int limit);

    // ========== 작성자 관련 ==========
    List<PostDTO> selectAuthorOtherPosts(
            @Param("authorId") Long authorId,
            @Param("currentPostId") Long currentPostId,
            @Param("limit") int limit
    );

    int countAuthorPosts(@Param("authorId") Long authorId);

    int countAuthorComments(@Param("authorId") Long authorId);

    // ========== 게시글 삭제 ==========
    void updateIsDeleted(@Param("postId") Long postId);
    
    // ✅ 팔로우 관련 추가
    int selectFollowExists(@Param("followerId") Long followerId, 
                           @Param("followingId") Long followingId);
    void insertFollow(@Param("followerId") Long followerId, 
                      @Param("followingId") Long followingId);
    void deleteFollow(@Param("followerId") Long followerId, 
                      @Param("followingId") Long followingId);
}

