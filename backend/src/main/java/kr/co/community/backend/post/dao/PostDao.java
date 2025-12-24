package kr.co.community.backend.post.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.dto.PostImageDTO;

@Mapper
public interface PostDao {

    int insertPost(PostDTO dto);
    Long selectPostSeqCurrval();

    int updatePost(PostDTO dto);
    int deletePost(@Param("postId") Long postId);
    PostDTO selectPostById(@Param("postId") Long postId);

    // ✅ 이미지
    int insertPostImage(
        @Param("postId") Long postId,
        @Param("origName") String origName,
        @Param("saveName") String saveName,
        @Param("contentType") String contentType,
        @Param("fileSize") Long fileSize,
        @Param("sortNo") int sortNo
    );

    List<PostImageDTO> selectImagesByPostId(@Param("postId") Long postId);

    PostImageDTO selectImageByImgId(@Param("imgId") Long imgId);

    int deletePostImage(@Param("imgId") Long imgId);

    Integer selectMaxSortNo(@Param("postId") Long postId);

    int updateImageSortNo(
        @Param("imgId") Long imgId,
        @Param("sortNo") int sortNo
    );
}