package kr.co.community.backend.admin.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.community.backend.admin.dto.AdminMemberDTO;
import kr.co.community.backend.admin.dto.AdminPostDTO;
import kr.co.community.backend.admin.dto.AdminReportDTO;

@Mapper
public interface AdminDao {

    int countMembers();
    int countPosts();
    int countComments();
    int countPendingReports();

    List<Map<String, Object>> selectRecentActivities();

    int countMembersFiltered(String q, String status);
    List<AdminMemberDTO> selectMembers(String q, String status, int size, int offset);

    int countPostsFiltered(String q, String categoryId);
    List<AdminPostDTO> selectPosts(String q, String categoryId, int size, int offset);

    int countReportsFiltered(String status);
    List<AdminReportDTO> selectReports(String status, int size, int offset);

 // ========== 방문자 통계 추가 ==========
    
    // 오늘 방문자 수 (IP 중복 제거)
    int countTodayVisitors();
    
    // 총 누적 방문자 수 (IP 중복 제거)
    int countTotalVisitors();
    
    // 방문 기록 저장
    void insertVisitHistory(String visitIp, String userAgent);


}
