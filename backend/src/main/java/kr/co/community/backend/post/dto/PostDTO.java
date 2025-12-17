package kr.co.community.backend.post.dto;

import java.util.Date;

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
}
