// AlertController.java
package kr.co.community.backend.alert.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.community.backend.alert.dto.AlertDTO;
import kr.co.community.backend.alert.service.AlertService;

@RestController
@RequestMapping("/alert")
@CrossOrigin("*")
public class AlertController {
    
    @Autowired
    private AlertService alertService;
    
    // 회원별 알림 목록 조회
    @GetMapping("/list/{memberId}")
    public ResponseEntity<List<AlertDTO>> getAlertList(@PathVariable int memberId) {
        List<AlertDTO> alertList = alertService.getAlertList(memberId);
        return ResponseEntity.ok(alertList);
    }
    
    // 알림 읽음 처리
    @PutMapping("/read/{alertId}")
    public ResponseEntity<String> updateRead(@PathVariable int alertId) {
        int result = alertService.updateRead(alertId);
        if (result > 0) {
            return ResponseEntity.ok("읽음 처리 완료");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("읽음 처리 실패");
    }
    
    // 알림 삭제
    @DeleteMapping("/delete/{alertId}")
    public ResponseEntity<String> deleteAlert(@PathVariable int alertId) {
        // 나중에 삭제 메서드 추가
        return ResponseEntity.ok("삭제 완료");
    }
    
    // 안읽은 알림 개수 조회
    @GetMapping("/unread/{memberId}")
    public ResponseEntity<Integer> getUnreadCount(@PathVariable int memberId) {
        int count = alertService.getUnreadCount(memberId);
        return ResponseEntity.ok(count);
    }
}