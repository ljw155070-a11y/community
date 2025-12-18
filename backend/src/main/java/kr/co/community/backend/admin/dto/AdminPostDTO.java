package kr.co.community.backend.admin.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AdminPostDTO {
    private Long postId;
    private String categoryName;
    private String title;
    private String authorName;
    private LocalDateTime createdAt;

    private int viewCount;
    private int likeCount;
    private int commentCount;
}
