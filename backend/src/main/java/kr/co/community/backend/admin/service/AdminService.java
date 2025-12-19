package kr.co.community.backend.admin.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.community.backend.admin.dao.AdminDao;
import kr.co.community.backend.admin.dto.AdminDashboardDTO;
import kr.co.community.backend.admin.dto.AdminMemberDTO;
import kr.co.community.backend.admin.dto.AdminPostDTO;
import kr.co.community.backend.admin.dto.AdminReportDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminDao adminDao;

    public AdminDashboardDTO getDashboard() {
        AdminDashboardDTO dto = new AdminDashboardDTO();
        dto.setTotalMembers(adminDao.countMembers());
        dto.setTotalPosts(adminDao.countPosts());
        dto.setTotalComments(adminDao.countComments());
        dto.setPendingReports(adminDao.countPendingReports());

        dto.setRecentActivities(adminDao.selectRecentActivities()); // 간단 텍스트 리스트
        return dto;
    }

    public Map<String, Object> getMembers(String q, String status, int page, int size) {
        int offset = (page - 1) * size;
        int total = adminDao.countMembersFiltered(q, status);

        List<AdminMemberDTO> rows = adminDao.selectMembers(q, status, size, offset);

        Map<String, Object> res = new HashMap<>();
        res.put("rows", rows);
        res.put("page", page);
        res.put("size", size);
        res.put("total", total);
        res.put("totalPages", (int)Math.ceil((double) total / size));
        return res;
    }

    public Map<String, Object> getPosts(String q, String categoryId, int page, int size) {
        int offset = (page - 1) * size;
        int total = adminDao.countPostsFiltered(q, categoryId);

        List<AdminPostDTO> rows = adminDao.selectPosts(q, categoryId, size, offset);

        Map<String, Object> res = new HashMap<>();
        res.put("rows", rows);
        res.put("page", page);
        res.put("size", size);
        res.put("total", total);
        res.put("totalPages", (int)Math.ceil((double) total / size));
        return res;
    }

    public Map<String, Object> getReports(String status, int page, int size) {
        int offset = (page - 1) * size;
        int total = adminDao.countReportsFiltered(status);

        List<AdminReportDTO> rows = adminDao.selectReports(status, size, offset);

        Map<String, Object> res = new HashMap<>();
        res.put("rows", rows);
        res.put("page", page);
        res.put("size", size);
        res.put("total", total);
        res.put("totalPages", (int)Math.ceil((double) total / size));
        return res;
    }

    public Map<String, Object> getSettings() {
        // DB 테이블 없으면 일단 더미
        Map<String, Object> res = new HashMap<>();
        res.put("siteName", "커뮤니티");
        res.put("siteDesc", "함께 소통하고 성장하는 커뮤니티 플랫폼");
        res.put("maintenance", false);
        res.put("allowSignup", true);

        res.put("emailVerify", true);
        res.put("minPasswordLen", 8);
        res.put("sessionTimeoutMin", 30);
        res.put("maxLoginTry", 5);

        res.put("emailNotify", true);
        res.put("pushNotify", false);
        res.put("reportNotify", true);
        res.put("newMemberNotify", false);

        return res;
    }

    public Map<String, Object> saveSettings(Map<String, Object> payload) {
        // 지금은 저장 로직 생략(요청대로 페이지 작업 먼저)
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("saved", payload);
        return res;
    }
}
