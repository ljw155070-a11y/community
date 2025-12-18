package kr.co.community.backend.post.dto;

import java.util.Date;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long commentId;
    private Long postId;
    private Long authorId;
    private Long parentCommentId;
    private String content;
    private String isDeleted;
    private Date createdAt;
    private Date updatedAt;
    
    private AuthorInfo author;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorInfo {
        private Long id;
        private String name;
        //private String profileImage;
    }
}