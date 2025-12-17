package kr.co.community.backend.main.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.community.backend.main.vo.NoticeVo;
import kr.co.community.backend.main.vo.PostVo;

@Mapper
public interface MainDao {

	List<PostVo> getPostList();

	List<NoticeVo> getNoticeList();

}
