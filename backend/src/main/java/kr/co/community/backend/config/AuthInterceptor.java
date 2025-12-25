package kr.co.community.backend.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.community.backend.member.dao.LoginSessionMapper;
import kr.co.community.backend.member.dto.LoginSessionDTO;
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
    private final LoginSessionMapper loginSessionMapper;  // 중복 로그인 체크를 위해 추가

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = extractToken(request);

        // ✅ 디버깅 로그 추가
        System.out.println("========== AuthInterceptor ==========");
        System.out.println("URL: " + request.getRequestURI());
        System.out.println("토큰: " + (token != null ? "있음 (" + token.substring(0, 20) + "...)" : "없음"));

        if (token != null && jwtUtil.validateToken(token)) {
            try {
                Long memberId = jwtUtil.getMemberIdFromToken(token);
                
                // DB에서 토큰 확인 - 다른 기기에서 로그인했으면 DB에 토큰이 없거나 다름
                LoginSessionDTO session = loginSessionMapper.findByMemberId(memberId);
                if (session == null || !token.equals(session.getToken())) {
                    System.out.println("❌ DB에 토큰 없음 (다른 곳에서 로그인됨)");
                    request.setAttribute("isAuthenticated", false);
                    System.out.println("====================================");
                    return true;
                }
                
                String email = jwtUtil.getEmailFromToken(token);
                String name = jwtUtil.getNameFromToken(token);
                String nickname = jwtUtil.getNicknameFromToken(token);

                request.setAttribute("memberId", memberId);
                request.setAttribute("email", email);
                request.setAttribute("name", name);
                request.setAttribute("nickname", nickname);
                request.setAttribute("isAuthenticated", true);
                request.setAttribute("loginMemberId", memberId);

                System.out.println("✅ 인증 성공: memberId=" + memberId + ", nickname=" + nickname);
                log.debug("✅ Authenticated: memberId={}, email={}", memberId, email);
            } catch (Exception e) {
                System.out.println("❌ JWT 파싱 실패: " + e.getMessage());
                log.error("❌ JWT 파싱 실패", e);
                request.setAttribute("isAuthenticated", false);
            }
        } else {
            System.out.println("🔓 비인증 요청 (토큰 없거나 유효하지 않음)");
            request.setAttribute("isAuthenticated", false);
            log.debug("🔓 Non-authenticated request");
        }
        System.out.println("====================================");

        return true;
    }

    /**
     * ✅ 토큰 추출: 1) Authorization Bearer 2) Cookie(accessToken)
     */
    private String extractToken(HttpServletRequest request) {
        // 1) Authorization: Bearer __xxx__
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            return auth.substring(7);
        }

        // 2) Cookie: accessToken=__xxx__
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