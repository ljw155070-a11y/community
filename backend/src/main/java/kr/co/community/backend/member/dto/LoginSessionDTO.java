package kr.co.community.backend.member.dto;

import java.util.Date;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("loginSession")
public class LoginSessionDTO {
    private Long sessionId;       // SESSION_ID
    private Long memberId;        // MEMBER_ID
    private String token;         // TOKEN
    private String loginIp;       // LOGIN_IP
    private Date loginTime;       // LOGIN_TIME
    private Date expireTime;      // EXPIRE_TIME
}