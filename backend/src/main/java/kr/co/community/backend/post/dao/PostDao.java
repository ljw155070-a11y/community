package kr.co.community.backend.post.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.post.dto.PostDTO;

@Mapper
public interface PostDao {

    int insertPost(PostDTO dto);

    Long selectPostSeqCurrval(); // insert 직후 생성된 post_id 반환용
    
    // ✅ 글 수정
    int updatePost(PostDTO dto);

    // ✅ 글 삭제(소프트 삭제)
    int deletePost(@Param("postId") Long postId);

    PostDTO selectPostById(@Param("postId") Long postId);
}
