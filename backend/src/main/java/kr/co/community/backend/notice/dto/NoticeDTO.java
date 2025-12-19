package kr.co.community.backend.notice.dto;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("noticeDTO")
public class NoticeDTO {
    private Long noticeId;        // NOTICE_ID
    private Long authorId;        // AUTHOR_ID
    private String noticeType;    // NOTICE_TYPE ('IMPORTANT', 'NORMAL')
    private String title;         // TITLE
    private String content;       // CONTENT
    private String isPinned;      // IS_PINNED ('Y', 'N')
    private Date startAt;         // START_AT
    private Date endAt;           // END_AT
    private Date createdAt;       // CREATED_AT
    private Date updatedAt;       // UPDATED_AT
    
    // JOIN용 필드
    private String authorName;
    private String authorNickname;
}