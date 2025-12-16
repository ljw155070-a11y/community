package kr.co.community.backend.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.community.backend.member.dto.MemberDTO;
import kr.co.community.backend.member.service.MemberService;

@RequestMapping(value="/member")
@CrossOrigin("*")
public class MemberController {
	
	@Autowired
	private MemberService memberService;
	
	@ResponseBody
	@PostMapping(value = "/login")
	public String login(MemberDTO member) { 
		MemberDTO m = memberService.login(member);
		if(m!=null) {
			
		}else {
			
		}
		return m;
	}
}
