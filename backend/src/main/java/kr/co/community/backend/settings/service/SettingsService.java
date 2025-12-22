package kr.co.community.backend.settings.service;

import kr.co.community.backend.settings.dao.SettingsDao;
import kr.co.community.backend.settings.dto.SettingsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    @Autowired
    private SettingsDao settingsDao;
    
    //암호화 비밀번호 조회
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 회원 설정 정보 조회
    public SettingsDTO getSettings(Long memberId) {
        return settingsDao.findById(memberId);
    }

    // 프로필 업데이트
    public void updateProfile(SettingsDTO settings) {
        settingsDao.updateProfile(settings);
    }
    
 // 비밀번호 확인
    public boolean checkPassword(Long memberId, String password) {
        String storedPassword = settingsDao.findPasswordById(memberId);
        return passwordEncoder.matches(password, storedPassword);
    }


    // 비밀번호 변경
    public boolean updatePassword(Long memberId, String currentPassword, String newPassword) {
        // 현재 비밀번호 가져오기
        String storedPassword = settingsDao.findPasswordById(memberId);
        
        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(currentPassword, storedPassword)) {
            return false;  // 비밀번호 틀림
        }
        
        // 새 비밀번호 해시화
        String newPasswordHash = passwordEncoder.encode(newPassword);
        
        // 비밀번호 업데이트
        settingsDao.updatePassword(memberId, newPasswordHash);
        
        return true;  // 성공
    }
}