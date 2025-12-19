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

		List<PostVo> viewTopPosts = mainService.getViewTopPosts();
		List<PostVo> likeTopPosts = mainService.getLikeTopPosts();
		List<PostVo> commentTopPosts = mainService.getCommentTopPosts();
		List<NoticeVo> noticeList = mainService.getNoticeList();

		model.addAttribute("viewTopPosts", viewTopPosts);
		model.addAttribute("likeTopPosts", likeTopPosts);
		model.addAttribute("commentTopPosts", commentTopPosts);
		model.addAttribute("noticeList", noticeList);

		System.out.println(viewTopPosts);
		System.out.println(likeTopPosts);
		System.out.println(commentTopPosts);
		System.out.println(noticeList);

		return "mainpage/mainpage";
	}
}