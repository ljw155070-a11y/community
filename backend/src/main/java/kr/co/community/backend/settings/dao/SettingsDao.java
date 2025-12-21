package kr.co.community.backend.settings.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.community.backend.settings.dto.SettingsDTO;

@Mapper
public interface SettingsDao {
    // 회원 설정 정보 조회
    SettingsDTO findById(Long memberId);
    
    // 프로필 업데이트
    void updateProfile(SettingsDTO settings);
    
    // 비밀번호 업데이트
    void updatePassword(Long memberId, String newPasswordHash);
    
    // 현재 비밀번호 조회
    String findPasswordById(Long memberId);
}