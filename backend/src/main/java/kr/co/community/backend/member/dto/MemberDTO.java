package kr.co.community.backend.member.dto;

import org.apache.ibatis.type.Alias;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="member")
public class MemberDTO {
	private String memberName;
}
