package kr.co.community.backend.notice.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.notice.dto.NoticeDTO;

@Mapper
public interface NoticeDao {
    
    // 공지사항 목록 개수
    int countNoticeList(@Param("type") String type, @Param("q") String q);
    
    // 공지사항 목록 조회
    List<NoticeDTO> selectNoticeList(
        @Param("type") String type,
        @Param("q") String q,
        @Param("startRow") int startRow,
        @Param("endRow") int endRow
    );
    
    // 공지사항 상세 조회
    NoticeDTO selectNoticeDetail(@Param("noticeId") Long noticeId);
    
    // 공지사항 작성
    void insertNotice(NoticeDTO notice);
}