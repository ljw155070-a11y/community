package kr.co.community.backend.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.community.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 쿠키에서 JWT 토큰 추출
        String token = extractTokenFromCookie(request);

        if (token != null && jwtUtil.validateToken(token)) {
            try {
                // JWT 토큰에서 정보 추출
                Long memberId = jwtUtil.getMemberIdFromToken(token);
                String email = jwtUtil.getEmailFromToken(token);
                String name = jwtUtil.getNameFromToken(token);
                String nickname = jwtUtil.getNicknameFromToken(token);

                // Request Attribute에 저장 (Thymeleaf에서 사용)
                request.setAttribute("memberId", memberId);
                request.setAttribute("email", email);
                request.setAttribute("name", name);
                request.setAttribute("nickname", nickname);
                request.setAttribute("isAuthenticated", true);
                
                log.debug("✅ Authenticated: memberId={}, email={}", memberId, email);
            } catch (Exception e) {
                log.error("❌ JWT 파싱 실패", e);
                request.setAttribute("isAuthenticated", false);
            }
        } else {
            request.setAttribute("isAuthenticated", false);
            log.debug("🔓 Non-authenticated request");
        }

        return true;
    }

    /**
     * 쿠키에서 JWT 토큰 추출
     */
    private String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}