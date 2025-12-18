package kr.co.community.backend.post.dto;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("postDTO")
public class PostDTO {

    private Long postId;        // POST_ID
    private Long categoryId;    // CATEGORY_ID
    private Long authorId;      // AUTHOR_ID

    private String title;       // TITLE
    private String content;     // CONTENT

    private Integer viewCount;      // VIEW_COUNT
    private Integer likeCount;      // LIKE_COUNT
    private Integer commentCount;   // COMMENT_COUNT

    private String isDeleted;   // IS_DELETED (예: 'N'/'Y')
    private Date createdAt;     // CREATED_AT
    private Date updatedAt;     // UPDATED_AT
    
    private String category;        // 카테고리명
    private AuthorInfo author;      // 작성자 정보
    private List<CommentDTO> comments;  // 댓글 리스트
    private Boolean isLiked;        // 좋아요 여부
    
    // 내부 클래스
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorInfo {
        private Long id;
        private String name;
        //private String profileImage;
    }
}
