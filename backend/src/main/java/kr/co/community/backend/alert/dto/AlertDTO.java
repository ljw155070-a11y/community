package kr.co.community.backend.alert.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 알림 DTO
@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value = "alert")
public class AlertDTO {
    private int alertId; // 알림 ID
    private int memberId; // 받는 사람 ID
    private String alertType; // 알림 타입 (COMMENT, LIKE, REPLY)
    private String content; // 알림 내용
    private Integer relatedPostId; // 관련 게시글 ID
    private Integer relatedCommentId; // 관련 댓글 ID
    private String isRead; // 읽음 여부 (Y/N)
    private Date createdAt; // 생성 시간
}