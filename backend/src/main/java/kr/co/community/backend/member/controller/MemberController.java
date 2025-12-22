package kr.co.community.backend.member.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.community.backend.member.dto.LoginRequestDTO;
import kr.co.community.backend.member.dto.LoginResponseDTO;
import kr.co.community.backend.member.dto.MemberDTO;
import kr.co.community.backend.member.service.MemberService;

@CrossOrigin("*")
@RestController
@RequestMapping("/member")
public class MemberController {

	@Autowired
	private MemberService memberService;

	
	// ✅ 로그인
	@PostMapping("/login")
	public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {

	    LoginResponseDTO response = new LoginResponseDTO();

	    try {
	        // ✅ JWT 토큰 발급
	        String token = memberService.login(loginRequest.getEmail(), loginRequest.getPassword());

	        // ✅ 로그인 성공 시 회원 정보도 내려주기 (민감정보 제거해서)
	        MemberDTO member = memberService.getMemberByEmail(loginRequest.getEmail());
	        if (member != null) {
	            member.setPasswordHash(null);
	            member.setPassword(null); // DTO에 password 필드 있으면 같이 제거
	        }

	        response.setSuccess(true);
	        response.setToken(token);      // ⭐ LoginResponseDTO에 token 필드가 있어야 함
	        response.setMember(member);

	        return ResponseEntity.ok(response);

	    } catch (RuntimeException e) {
	        response.setSuccess(false);
	        response.setMessage(e.getMessage());
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	    }
	}


	// ✅ 이메일 중복 체크
	// GET http://localhost:9999/member/email-exists?email=aaa@bbb.com
	@GetMapping("/email-exists")
	public Map<String, Object> emailExists(@RequestParam("email") String email) {
		System.out.println("컨트롤러 호출");
		boolean exists = memberService.emailExists(email);

		Map<String, Object> result = new HashMap<>();
		result.put("exists", exists);
		return result;
	}

	// ✅ 회원가입
	// POST http://localhost:9999/member/signup
	@PostMapping("/signup")
	public Map<String, Object> signup(@RequestBody MemberDTO dto) {
		System.out.println("컨트롤러 호출");
		int rows = memberService.signup(dto);

		Map<String, Object> result = new HashMap<>();
		result.put("success", rows == 1);
		return result;
	}
	// ========== 마이페이지 관련 API ==========
	
		/**
		 * 회원 정보 및 활동 통계 조회
		 * GET http://localhost:9999/member/mypage/profile/{memberId}
		 * @param memberId 회원 ID
		 * @return 회원 정보 + 통계 데이터
		 */
		@GetMapping("/mypage/profile/{memberId}")
		public ResponseEntity<Map<String, Object>> getMyPageProfile(@PathVariable Long memberId) {
			try {
				// 회원 정보 조회
				MemberDTO member = memberService.getMemberInfo(memberId);
				
				if (member == null) {
					Map<String, Object> error = new HashMap<>();
					error.put("error", "회원 정보를 찾을 수 없습니다.");
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
				}
				
				// 활동 통계 조회
				Map<String, Object> stats = memberService.getMemberStats(memberId);
				
				// 응답 데이터 구성
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
		 * GET http://localhost:9999/member/mypage/posts/{memberId}
		 * @param memberId 회원 ID
		 * @return 작성한 글 목록
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
		 * GET http://localhost:9999/member/mypage/comments/{memberId}
		 * @param memberId 회원 ID
		 * @return 작성한 댓글 목록
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
		 * GET http://localhost:9999/member/mypage/liked-posts/{memberId}
		 * @param memberId 회원 ID
		 * @return 좋아요한 글 목록
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
}
