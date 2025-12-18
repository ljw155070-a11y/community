package kr.co.community.backend.alert.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.community.backend.alert.dao.AlertDao;
import kr.co.community.backend.alert.dto.AlertDTO;

@Service
public class AlertService {
    
    @Autowired
    private AlertDao alertDao;
    
    // 알림 저장
    public int saveAlert(AlertDTO alertDto) {
        return alertDao.saveAlert(alertDto);
    }
    
    // 회원별 알림 목록 조회
    public List<AlertDTO> getAlertList(int memberId) {
        return alertDao.getAlertList(memberId);
    }
    
    // 알림 읽음 처리
    public int updateRead(int alertId) {
        return alertDao.updateRead(alertId);
    }
    
    // 안읽은 알림 개수 조회
    public int getUnreadCount(int memberId) {
        return alertDao.getUnreadCount(memberId);
    }
}