package kr.co.community.backend.member.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.member.dto.MemberDTO;

@Mapper
public interface MemberDao {

    int countByEmail(@Param("email") String email);

    // ✅ 닉네임이 이미 존재하는지
    int countByNickname(@Param("nickname") String nickname);

    // ✅ base(이름)로 시작하는 "이름#0001" 패턴 중 최대 suffix 조회
    Integer selectMaxNicknameSuffix(@Param("base") String base);
    
    int insertMember(MemberDTO dto);
    
    MemberDTO selectMemberByEmail(String username);
}
