package kr.co.community.backend.member.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.community.backend.member.dao.LoginSessionMapper;
import kr.co.community.backend.member.dto.LoginSessionDTO;
import kr.co.community.backend.member.dto.MemberDTO;
import kr.co.community.backend.member.service.MemberService;
import kr.co.community.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberApiController {

    private final MemberService memberService;
    private final LoginSessionMapper loginSessionMapper;  // ⭐ 추가
    private final JwtUtil jwtUtil;  // ✅ 추가
    
    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginRequest,
            HttpServletResponse response
    ) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            log.info("🔐 API 로그인 요청: {}", email);

            // ⭐ [중복 로그인] MemberService.login()에서 처리됨
            // - 기존 세션 삭제
            // - 새 세션 저장
            String token = memberService.login(email, password);
            
            // 회원 정보 조회
            MemberDTO member = memberService.getMemberByEmail(email);

            // HttpOnly 쿠키에 JWT 토큰 저장
            Cookie cookie = new Cookie("accessToken", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24);  // 24시간
            
            response.addCookie(cookie);

            // ⭐ [중복 로그인] 사용자에게 알림 메시지 전달
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "로그인 성공. 다른 기기에서 로그인한 경우 해당 기기는 자동 로그아웃됩니다.");
            result.put("token", token);
            result.put("user", Map.of(
                "memberId", member.getMemberId(),
                "email", member.getEmail(),
                "name", member.getName(),
                "nickname", member.getNickname(),
                "profileImage", member.getProfileImage() != null ? member.getProfileImage() : "" 
            ));

            log.info("✅ API 로그인 성공: {}", email);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("❌ API 로그인 실패: {}", e.getMessage());
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    /**
     * 로그아웃 API
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(value = "accessToken", required = false) String token,
            HttpServletResponse response
    ) {
        log.info("🚪 로그아웃 요청");
        
        try {
            // ✅ DB 세션 삭제
            if (token != null) {
                Long memberId = memberService.getMemberIdFromToken(token);
                if (memberId != null) {
                    loginSessionMapper.deleteByMemberId(memberId);
                    log.info("✅ DB 세션 삭제: memberId={}", memberId);
                }
            }
        } catch (Exception e) {
            log.warn("세션 삭제 중 오류 (무시): {}", e.getMessage());
        }
        
        // 쿠키 삭제
        Cookie cookie = new Cookie("accessToken", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        
        response.addCookie(cookie);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "로그아웃 성공");

        return ResponseEntity.ok(result);
    }

    /**
     * 회원가입 API
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody MemberDTO memberDTO) {
        try {
            log.info("📝 API 회원가입 요청: {}", memberDTO.getEmail());
            
            Long memberId = memberService.register(memberDTO);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "회원가입 성공");
            result.put("memberId", memberId);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("❌ API 회원가입 실패: {}", e.getMessage());
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * 이메일 중복 확인 API
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean isDuplicate = memberService.checkEmailDuplicate(email);

        Map<String, Object> result = new HashMap<>();
        result.put("isDuplicate", isDuplicate);
        result.put("available", !isDuplicate);

        return ResponseEntity.ok(result);
    }

    /**
     * 닉네임 중복 확인 API
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean isDuplicate = memberService.checkNicknameDuplicate(nickname);

        Map<String, Object> result = new HashMap<>();
        result.put("isDuplicate", isDuplicate);
        result.put("available", !isDuplicate);

        return ResponseEntity.ok(result);
    }

    /**
     * 현재 로그인 사용자 정보 조회
     * 
     * ⭐ [중복 로그인] DB에서 토큰 검증 추가
     * - 쿠키의 토큰이 DB에 있는지 확인
     * - 없으면 401 에러 (다른 기기에서 로그인함)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @CookieValue(value = "accessToken", required = false) String token
    ) {
        try {
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("success", false, "message", "로그인이 필요합니다.")
                );
            }

            // JWT에서 회원 ID 추출
            Long memberId = memberService.getMemberIdFromToken(token);
            
            // ⭐ [중복 로그인] DB에서 토큰 확인
            // - DB에 저장된 토큰과 쿠키의 토큰 비교
            // - 다르면 다른 기기에서 로그인한 것
            LoginSessionDTO session = loginSessionMapper.findByMemberId(memberId);
            if (session == null || !token.equals(session.getToken())) {
                // DB에 토큰 없음 = 다른 곳에서 로그인됨
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("success", false, "message", "다른 기기에서 로그인되었습니다.")
                );
            }
            
            // 회원 정보 조회
            MemberDTO member = memberService.getMemberInfo(memberId);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("user", Map.of(
                "memberId", member.getMemberId(),
                "email", member.getEmail(),
                "name", member.getName(),
                "nickname", member.getNickname(),
                "profileImage", member.getProfileImage() != null ? member.getProfileImage() : ""  
            ));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("success", false, "message", "유효하지 않은 토큰입니다.")
            );
        }
    }
}