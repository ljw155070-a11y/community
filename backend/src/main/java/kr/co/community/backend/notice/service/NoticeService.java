package kr.co.community.backend.notice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.community.backend.notice.dao.NoticeDao;
import kr.co.community.backend.notice.dto.NoticeDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeDao noticeDao;

    // ✅ 공지사항 목록
    public Map<String, Object> getNoticeList(String type, String q, int page, int size) {
        if (page < 1) page = 1;
        
        int total = noticeDao.countNoticeList(type, q);
        int offset = (page - 1) * size;
        int startRow = offset + 1;
        int endRow = offset + size;
        
        List<NoticeDTO> notices = noticeDao.selectNoticeList(type, q, startRow, endRow);
        
        int totalPages = (int) Math.ceil((double) total / size);
        
        Map<String, Object> result = new HashMap<>();
        result.put("notices", notices);
        result.put("page", page);
        result.put("totalPages", totalPages);
        result.put("total", total);
        
        return result;
    }
    
    // ✅ 공지사항 상세
    public NoticeDTO getNoticeDetail(Long noticeId) {
        return noticeDao.selectNoticeDetail(noticeId);
    }
    
    // ✅ 조회수 증가
    public void increaseViewCount(Long noticeId) {
        // 조회수 필드가 없으므로 제거
    }
    
    // ✅ 공지사항 작성
    public void createNotice(NoticeDTO notice) {
        noticeDao.insertNotice(notice);
    }
}