package kr.co.community.backend.settings.controller;

import kr.co.community.backend.settings.dto.PasswordChangeDTO;
import kr.co.community.backend.settings.dto.SettingsDTO;
import kr.co.community.backend.settings.service.SettingsService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@CrossOrigin("*")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    // 설정 정보 조회
    @GetMapping("/{memberId}")
    public ResponseEntity<SettingsDTO> getSettings(@PathVariable Long memberId) {
        SettingsDTO settings = settingsService.getSettings(memberId);
        return ResponseEntity.ok(settings);
    }

    // 프로필 업데이트
    @PutMapping("/profile/{memberId}")
    public ResponseEntity<String> updateProfile(
            @PathVariable Long memberId,
            @RequestBody SettingsDTO settings) {
        
        settings.setMemberId(memberId);
        settingsService.updateProfile(settings);
        
        return ResponseEntity.ok("프로필이 수정되었습니다.");
    }
    // 비밀번호 확인
    @PostMapping("/check-password/{memberId}")
    public ResponseEntity<Map<String, Boolean>> checkPassword(
            @PathVariable Long memberId,
            @RequestBody Map<String, String> data) {
        
        String password = data.get("password");
        boolean isValid = settingsService.checkPassword(memberId, password);
        
        Map<String, Boolean> result = new HashMap<>();
        result.put("isValid", isValid);
        
        return ResponseEntity.ok(result);
    }

    // 비밀번호 변경
    @PutMapping("/password/{memberId}")
    public ResponseEntity<String> updatePassword(
            @PathVariable Long memberId,
            @RequestBody PasswordChangeDTO passwordChange) {
        
        boolean success = settingsService.updatePassword(
            memberId,
            passwordChange.getCurrentPassword(),
            passwordChange.getNewPassword()
        );
        
        if (success) {
            return ResponseEntity.ok("비밀번호가 변경되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("현재 비밀번호가 일치하지 않습니다.");
        }
    }
}