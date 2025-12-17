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

	public List<PostVo> getPostList() {
		
		List<PostVo> postList = mainDao.getPostList();
		
		return postList;
	}

	public List<NoticeVo> getNoticeList() {
		
		List<NoticeVo> noticeList = mainDao.getNoticeList();
		
		return noticeList;
	}
}
