package kr.co.community.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import kr.co.community.backend.admin.service.AdminService;
import lombok.RequiredArgsConstructor;

/**
 * 방문자 기록 인터셉터
 * 모든 요청마다 방문 기록 저장
 */
@Component
@RequiredArgsConstructor
public class VisitInterceptor implements HandlerInterceptor {

    // AdminService만 주입
    private final AdminService adminService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 방문자 IP 가져오기
        String visitIp = getClientIp(request);
        
        // User-Agent 가져오기 (브라우저 정보)
        String userAgent = request.getHeader("User-Agent");
        
        // 방문 기록 저장
        adminService.recordVisit(visitIp, userAgent);
        
        return true;
    }

    /**
     * 클라이언트 IP 주소 추출
     * 프록시 서버 거치는 경우도 처리
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        return ip;
    }
}