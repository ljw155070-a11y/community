package kr.co.community.backend.member.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.co.community.backend.member.dto.LoginSessionDTO;

@Mapper
public interface LoginSessionMapper {
    
    /**
     * 회원 ID로 세션 조회
     */
    LoginSessionDTO findByMemberId(@Param("memberId") Long memberId);
    
    /**
     * 세션 저장
     */
    void save(LoginSessionDTO session);
    
    /**
     * 회원 ID로 세션 삭제
     */
    void deleteByMemberId(@Param("memberId") Long memberId);
}