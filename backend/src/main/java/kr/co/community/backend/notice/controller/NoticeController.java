package kr.co.community.backend.notice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import kr.co.community.backend.member.dto.MemberDTO;
import kr.co.community.backend.notice.dto.NoticeDTO;
import kr.co.community.backend.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;

    // ✅ 공지사항 목록
    @GetMapping("")
    public String noticeList(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            Model model,
            HttpSession session
    ) {
        int size = 10;
        Map<String, Object> listResult = noticeService.getNoticeList(type, q, page, size);
        
        int totalPages = (int) listResult.get("totalPages");
        int currentPage = (int) listResult.get("page");
        
        // ✅ 페이지네이션: 5개씩 노출
        int window = 5;
        int half = window / 2;
        int startPage = Math.max(1, currentPage - half);
        int endPage = startPage + window - 1;
        
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - window + 1);
        }
        
        int prevPage = Math.max(1, currentPage - 5);
        int nextPage = Math.min(totalPages, currentPage + 5);
        
        // ✅ 관리자 여부 확인
        MemberDTO loginMember = (MemberDTO) session.getAttribute("loginMember");
        boolean isAdmin = loginMember != null && "ADMIN".equals(loginMember.getRole());
        
        model.addAttribute("type", type);
        model.addAttribute("q", q == null ? "" : q);
        model.addAttribute("notices", listResult.get("notices"));
        model.addAttribute("page", currentPage);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("total", listResult.get("total"));
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("prevPage", prevPage);
        model.addAttribute("nextPage", nextPage);
        model.addAttribute("isAdmin", isAdmin);
        
        return "notice/noticeList";
    }
    
    // ✅ 공지사항 상세
    @GetMapping("/{noticeId}")
    public String noticeDetail(
            @PathVariable Long noticeId,
            Model model,
            HttpSession session
    ) {
        NoticeDTO notice = noticeService.getNoticeDetail(noticeId);
        
        if (notice == null) {
            return "redirect:/notice";
        }
        
        // ✅ 관리자 여부 확인
        MemberDTO loginMember = (MemberDTO) session.getAttribute("loginMember");
        boolean isAdmin = loginMember != null && "ADMIN".equals(loginMember.getRole());
        
        model.addAttribute("notice", notice);
        model.addAttribute("isAdmin", isAdmin);
        
        return "notice/noticeDetail";
    }
    
    // ✅ 공지사항 작성 폼 (관리자만)
    @GetMapping("/write")
    public String noticeWriteForm(HttpSession session) {
        MemberDTO loginMember = (MemberDTO) session.getAttribute("loginMember");
        
        if (loginMember == null || !"ADMIN".equals(loginMember.getRole())) {
            return "redirect:/notice";
        }
        
        return "notice/noticeWrite";
    }
    
    // ✅ 공지사항 작성 처리 (관리자만)
    @PostMapping("/write")
    public String noticeWrite(
            @RequestParam String noticeType,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String isPinned,
            @RequestParam(required = false) String startAt,
            @RequestParam(required = false) String endAt,
            HttpSession session
    ) {
        MemberDTO loginMember = (MemberDTO) session.getAttribute("loginMember");
        
        if (loginMember == null || !"ADMIN".equals(loginMember.getRole())) {
            return "redirect:/notice";
        }
        
        NoticeDTO notice = new NoticeDTO();
        notice.setNoticeType(noticeType);
        notice.setTitle(title);
        notice.setContent(content);
        notice.setAuthorId(loginMember.getMemberId());
        notice.setIsPinned(isPinned != null && isPinned.equals("on") ? "Y" : "N");
        
        // 날짜 변환 (간단하게 처리)
        // 실제로는 SimpleDateFormat 사용
        
        noticeService.createNotice(notice);
        
        return "redirect:/notice";
    }
}