package kr.co.community.backend.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import kr.co.community.backend.admin.service.AdminService;
import kr.co.community.backend.admin.dto.AdminDashboardDTO;
import kr.co.community.backend.admin.dto.AdminMemberDTO;
import kr.co.community.backend.admin.dto.AdminPostDTO;
import kr.co.community.backend.admin.dto.AdminReportDTO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminApiController {

    private final AdminService adminService;

    // 대시보드 (카드/최근활동/빠른작업)
    @GetMapping("/dashboard")
    public AdminDashboardDTO dashboard() {
        return adminService.getDashboard();
    }

    // 회원 목록
    @GetMapping("/members")
    public Map<String, Object> members(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getMembers(q, status, page, size);
    }

    // 게시글 목록
    @GetMapping("/posts")
    public Map<String, Object> posts(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "ALL") String categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getPosts(q, categoryId, page, size);
    }

    // 신고 목록
    @GetMapping("/reports")
    public Map<String, Object> reports(
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getReports(status, page, size);
    }

    // 운영 설정 (지금은 더미로 내려도 되고, DB 있으면 연결)
    @GetMapping("/settings")
    public Map<String, Object> settings() {
        return adminService.getSettings();
    }

    @PostMapping("/settings")
    public Map<String, Object> saveSettings(@RequestBody Map<String, Object> payload) {
        return adminService.saveSettings(payload);
    }
}
