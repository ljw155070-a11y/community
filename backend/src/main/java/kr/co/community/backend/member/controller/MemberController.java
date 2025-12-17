package kr.co.community.backend.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.community.backend.member.dto.MemberDTO;
import kr.co.community.backend.member.service.MemberService;

@CrossOrigin("*")
@RestController
@RequestMapping("/member")
public class MemberController {

	@Autowired
	private MemberService memberService;

	/*
	// ✅ 로그인
	@ResponseBody
	@PostMapping(value = "/login")
	public String login(MemberDTO member) {

		MemberDTO m = memberService.login(member);
		if (m != null) {

		} else {

		}
		return m;
		
	}
*/

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
}
