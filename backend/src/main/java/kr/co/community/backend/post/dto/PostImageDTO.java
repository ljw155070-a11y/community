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
@Alias("postImageDTO")
public class PostImageDTO {
    private Long imgId;
    private Long postId;
    private String origName;
    private String saveName;
    private String contentType;
    private Long fileSize;
    private Integer sortNo;
    private Date createdAt;

 // ✅ 화면에서 바로 쓰기 편하게 URL도 만들어줄 수 있음(선택)
    public String getUrl() {
        if (saveName == null) return null;
        return "/uploads/" + saveName;
    }
}