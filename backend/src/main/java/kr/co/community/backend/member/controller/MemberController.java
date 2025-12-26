package kr.co.community.backend.member.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import kr.co.community.backend.member.dto.LoginRequestDTO;
import kr.co.community.backend.member.dto.LoginResponseDTO;
import kr.co.community.backend.member.dto.MemberDTO;
import kr.co.community.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // ✅ 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {

        LoginResponseDTO response = new LoginResponseDTO();

        try {
            String token = memberService.login(loginRequest.getEmail(), loginRequest.getPassword());

            MemberDTO member = memberService.getMemberByEmail(loginRequest.getEmail());
            if (member != null) {
                member.setPasswordHash(null);
                member.setPassword(null);
            }

            response.setSuccess(true);
            response.setToken(token);
            response.setMember(member);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // ✅ 이메일 중복 체크
    @GetMapping("/email-exists")
    public Map<String, Object> emailExists(@RequestParam("email") String email) {
        boolean exists = memberService.emailExists(email);
        Map<String, Object> result = new HashMap<>();
        result.put("exists", exists);
        return result;
    }

    // ✅ 회원가입
    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody MemberDTO dto) {
        int rows = memberService.signup(dto);
        Map<String, Object> result = new HashMap<>();
        result.put("success", rows == 1);
        return result;
    }

    // ========== 마이페이지 관련 API ==========

    /**
     * 회원 정보 및 활동 통계 조회
     * GET /member/mypage/profile/{memberId}
     */
    @GetMapping("/mypage/profile/{memberId}")
    public ResponseEntity<Map<String, Object>> getMyPageProfile(@PathVariable Long memberId) {
        try {
            MemberDTO member = memberService.getMemberInfo(memberId);

            if (member == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "회원 정보를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            Map<String, Object> stats = memberService.getMemberStats(memberId);

            Map<String, Object> response = new HashMap<>();
            response.put("member", member);
            response.put("stats", stats);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * 회원이 작성한 글 목록 조회
     * GET /member/mypage/posts/{memberId}
     */
    @GetMapping("/mypage/posts/{memberId}")
    public ResponseEntity<Map<String, Object>> getMyPosts(@PathVariable Long memberId) {
        try {
            List<Map<String, Object>> posts = memberService.getMemberPosts(memberId);

            Map<String, Object> response = new HashMap<>();
            response.put("posts", posts);
            response.put("count", posts.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "게시글 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * 회원이 작성한 댓글 목록 조회
     * GET /member/mypage/comments/{memberId}
     */
    @GetMapping("/mypage/comments/{memberId}")
    public ResponseEntity<Map<String, Object>> getMyComments(@PathVariable Long memberId) {
        try {
            List<Map<String, Object>> comments = memberService.getMemberComments(memberId);

            Map<String, Object> response = new HashMap<>();
            response.put("comments", comments);
            response.put("count", comments.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "댓글 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * 회원이 좋아요한 글 목록 조회
     * GET /member/mypage/liked-posts/{memberId}
     */
    @GetMapping("/mypage/liked-posts/{memberId}")
    public ResponseEntity<Map<String, Object>> getLikedPosts(@PathVariable Long memberId) {
        try {
            List<Map<String, Object>> likedPosts = memberService.getMemberLikedPosts(memberId);

            Map<String, Object> response = new HashMap<>();
            response.put("likedPosts", likedPosts);
            response.put("count", likedPosts.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "좋아요한 글 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * ✅ 프로필 이미지 업로드
     * POST /member/mypage/profile-image/{memberId}
     * form-data: file
     */
    @PostMapping(value = "/mypage/profile-image/{memberId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadProfileImage(
            @PathVariable Long memberId,
            @RequestPart("file") MultipartFile file
    ) {
        try {
            String saveName = memberService.saveProfileImage(memberId, file);

            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("saveName", saveName);
            res.put("url", "/uploads/" + saveName); // WebMvcConfig가 이걸 서빙
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    // ========== 아이디/비밀번호 찾기 관련 API ==========

    @GetMapping("/find-id")
    public ResponseEntity<Map<String, Object>> findId(
            @RequestParam("name") String name,
            @RequestParam("email") String email) {

        Map<String, Object> response = new HashMap<>();

        try {
            MemberDTO member = memberService.findIdByNameAndEmail(name, email);

            if (member != null) {
                response.put("success", true);
                response.put("email", member.getEmail());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "일치하는 회원 정보를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/verify-account")
    public ResponseEntity<Map<String, Object>> verifyAccount(
            @RequestParam("email") String email,
            @RequestParam("name") String name) {

        Map<String, Object> response = new HashMap<>();

        try {
            boolean isValid = memberService.verifyAccountByEmailAndName(email, name);

            if (isValid) {
                response.put("success", true);
                response.put("message", "계정 확인이 완료되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "일치하는 회원 정보를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {

        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");

            if (email == null || email.isBlank() || newPassword == null || newPassword.isBlank()) {
                response.put("success", false);
                response.put("message", "이메일과 새 비밀번호를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword.length() < 6) {
                response.put("success", false);
                response.put("message", "비밀번호는 최소 6자 이상이어야 합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            boolean success = memberService.resetPassword(email, newPassword);

            if (success) {
                response.put("success", true);
                response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "비밀번호 변경에 실패했습니다.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
