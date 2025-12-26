package kr.co.community.backend.member.dto;

import java.util.Date;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("member")
public class MemberDTO {
	  private Long memberId;       // MEMBER_ID
	  private String email;        // EMAIL
	  private String password;     // 프론트에서 받는 원문(백엔드에서 해시)
	  private String passwordHash; // DB 저장용(선택: 서비스에서 세팅)
	  private String name;         // NAME
	  private String nickname;     // NICKNAME
	  private String role;         // ROLE
	  private String status;       // STATUS
	  private String createdAt;		//가입일
	  private String updatedAt;		//수정일
	  private String lastLoginAt;	//마지막 로그인 날짜
	  private String profileImage;
}

