package kr.co.community.backend.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/terms")
public class TermsController {

    /**
     * 이용약관 페이지
     */
    @GetMapping("")
    public String terms() {
        return "common/terms";
    }
    
    /**
     * 서비스 이용약관 (직접 접근)
     */
    @GetMapping("/service")
    public String serviceTerms() {
        return "common/terms";
    }
    
    /**
     * 개인정보 처리방침 (직접 접근)
     */
    @GetMapping("/privacy")
    public String privacyPolicy() {
        return "common/terms";
    }
    
    /**
     * 커뮤니티 가이드 (직접 접근)
     */
    @GetMapping("/community")
    public String communityGuide() {
        return "common/terms";
    }
}
