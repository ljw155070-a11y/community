package kr.co.community.backend.member.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.member.dto.MemberDTO;

@Mapper
public interface MemberDao {

    int countByEmail(@Param("email") String email);

    int insertMember(MemberDTO dto);
}
