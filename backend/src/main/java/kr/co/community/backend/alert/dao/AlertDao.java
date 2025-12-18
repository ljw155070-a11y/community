package kr.co.community.backend.alert.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.community.backend.alert.dto.AlertDTO;

@Mapper
public interface AlertDao {
    
    // 알림 저장
    int saveAlert(AlertDTO alertDto);
    
    // 회원별 알림 목록 조회
    List<AlertDTO> getAlertList(int memberId);
    
    // 알림 읽음 처리
    int updateRead(int alertId);
    
    // 안읽은 알림 개수 조회
    int getUnreadCount(int memberId);
}