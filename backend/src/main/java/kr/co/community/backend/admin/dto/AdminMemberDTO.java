package kr.co.community.backend.admin.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AdminMemberDTO {
    private Long memberId;
    private String name;
    private String email;
    private String status;  // ACTIVE / BANNED 등
    private String role;    // USER / ADMIN 등
    private LocalDateTime createdAt;

    private int postCount;
    private int commentCount;
}
