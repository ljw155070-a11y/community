package kr.co.community.backend.main.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.category.service.BoardCategoryService;
import kr.co.community.backend.main.service.MainService;
import kr.co.community.backend.main.vo.NoticeVo;
import kr.co.community.backend.main.vo.PostVo;

@Controller
@RequestMapping(value = "/mainpage")
public class MainController {

	@Autowired
	private MainService mainService;

	@Autowired
	private BoardCategoryService boardCategoryService;

	@GetMapping
	public String showMain(HttpServletRequest request, Model model) {

		// 로그인 여부 확인
		Boolean isAuthenticated = (Boolean) request.getAttribute("isAuthenticated");
		boolean isLoggedIn = isAuthenticated != null && isAuthenticated;

		model.addAttribute("isLoggedIn", isLoggedIn);
		model.addAttribute("isAuthenticated", isAuthenticated);
		// 공지사항 (로그인 여부 상관없이 표시)
		List<NoticeVo> noticeList = mainService.getNoticeList();
		model.addAttribute("noticeList", noticeList);
		
		// 인기 게시글 (로그인 여부 상관없이 표시)
		List<PostVo> viewTopPosts = mainService.getViewTopPosts();
		List<PostVo> likeTopPosts = mainService.getLikeTopPosts();
		List<PostVo> commentTopPosts = mainService.getCommentTopPosts();

		model.addAttribute("viewTopPosts", viewTopPosts);
		model.addAttribute("likeTopPosts", likeTopPosts);
		model.addAttribute("commentTopPosts", commentTopPosts);

		// 카테고리별 최신 게시글 (로그인 여부 상관없이 표시)
		List<BoardCategoryDTO> categories = boardCategoryService.getActiveCategories();
		Map<String, List<PostVo>> categoryPosts = new HashMap<>();

		for (BoardCategoryDTO category : categories) {
			List<PostVo> posts = mainService.getRecentPostsByCategory(category.getCategoryId());
			categoryPosts.put(category.getCategoryName(), posts);
		}

		model.addAttribute("categories", categories);
		model.addAttribute("categoryPosts", categoryPosts);

		return "mainpage/mainpage";
	}
}