package kr.co.community.backend.member.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="/member")
public class MemberDTO {
	private int memberId;			//pk
	private String email;			//회원 로그인ID
	private String passwordHash;	//암호화된 비밀번호(bcrypt)
	private String name;			//회원 이름
	private String nickname;		//회원 닉네임
	private String role;			//회원 등급(일반회원인지 관리자인지)
	private String status;			//회원 권한 상태(활성화/비활성화/정지)
	private String createdAt;		//가입일
	private String updatedAt;		//수정일
	private String lastLoginAt;		//마지막 로그인 날짜
}
