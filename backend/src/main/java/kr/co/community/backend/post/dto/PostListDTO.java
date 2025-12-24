package kr.co.community.backend.post.dto;

import java.util.Date;
import lombok.Data;
import org.apache.ibatis.type.Alias;

@Data
@Alias("postList")
public class PostListDTO {
    private Long postId;

    private Long categoryId;
    private String categoryName;

    private Long authorId;
    private String authorName; // NVL(nickname, name)

    private String title;
    private String contentPreview;

    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;

    private Date createdAt;
    // ✅ 추가: 목록용 첫 이미지
    private String firstImageSaveName;
}
