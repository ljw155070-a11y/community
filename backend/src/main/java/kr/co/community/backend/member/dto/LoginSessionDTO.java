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
    private String token;         // TOKEN - JWT 토큰값
    private String loginIp;       // LOGIN_IP - 로그인한 IP 주소
    private Date loginTime;       // LOGIN_TIME - 로그인 시간
    private Date expireTime;      // EXPIRE_TIME - 토큰 만료 시간
}