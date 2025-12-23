package kr.co.community.backend.main.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.community.backend.main.dao.MainDao;
import kr.co.community.backend.main.vo.NoticeVo;
import kr.co.community.backend.main.vo.PostVo;

@Service
public class MainService {
	@Autowired
	private MainDao mainDao;

	public List<PostVo> getViewTopPosts() {
		List<PostVo> viewTopPosts = mainDao.getViewTopPosts();
		return viewTopPosts;
	}

	public List<PostVo> getLikeTopPosts() {
		List<PostVo> likeTopPosts = mainDao.getLikeTopPosts();
		return likeTopPosts;
	}

	public List<PostVo> getCommentTopPosts() {
		List<PostVo> commentTopPosts = mainDao.getCommentTopPosts();
		return commentTopPosts;
	}

	public List<NoticeVo> getNoticeList() {
		List<NoticeVo> noticeList = mainDao.getNoticeList();
		return noticeList;
	}
	
	public List<PostVo> getRecentPostsByCategory(Integer categoryId) {
		return mainDao.getRecentPostsByCategory(categoryId);
	}
}