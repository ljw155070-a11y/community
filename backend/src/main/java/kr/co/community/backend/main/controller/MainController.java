package kr.co.community.backend.main.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.community.backend.main.service.MainService;
import kr.co.community.backend.main.vo.NoticeVo;
import kr.co.community.backend.main.vo.PostVo;

@Controller
@RequestMapping(value = "/mainpage")
public class MainController {

	@Autowired
	private MainService mainService;
	
	
	@GetMapping 
	public String showMain(Model model) {
		
		List<PostVo> postList = mainService.getPostList(); // 인기게시글 담아올 리스트 생성
		List<NoticeVo> noticeList = mainService.getNoticeList(); // 공지사항 
		
		model.addAttribute("postList", postList); //모달 어트리뷰트로 페이지에 보내기
		model.addAttribute("noticeList", noticeList);
		
		System.out.println(postList);
		System.out.println(noticeList);
		
		return "mainpage/mainpage";
	}
}
