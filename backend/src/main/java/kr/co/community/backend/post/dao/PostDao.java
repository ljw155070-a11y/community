package kr.co.community.backend.post.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.community.backend.post.dto.PostDTO;

@Mapper
public interface PostDao {

    int insertPost(PostDTO dto);

    Long selectPostSeqCurrval(); // insert 직후 생성된 post_id 반환용
}
