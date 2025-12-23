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
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // ✅ 쿠키 + Authorization(Bearer) 둘 다 지원
        String token = extractToken(request);

        if (token != null && jwtUtil.validateToken(token)) {
            try {
                Long memberId = jwtUtil.getMemberIdFromToken(token);
                String email = jwtUtil.getEmailFromToken(token);
                String name = jwtUtil.getNameFromToken(token);
                String nickname = jwtUtil.getNicknameFromToken(token);

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
     * ✅ 토큰 추출: 1) Authorization Bearer 2) Cookie(accessToken)
     */
    private String extractToken(HttpServletRequest request) {
        // 1) Authorization: Bearer xxx
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            return auth.substring(7);
        }

        // 2) Cookie: accessToken=xxx
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
