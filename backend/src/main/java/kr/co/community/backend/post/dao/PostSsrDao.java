package kr.co.community.backend.post.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dto.PostListDTO;

@Mapper
public interface PostSsrDao {

    List<BoardCategoryDTO> selectActiveCategories();

    int countPostList(
            @Param("categoryId") Long categoryId,
            @Param("q") String q
    );

    List<PostListDTO> selectPostList(
            @Param("categoryId") Long categoryId,
            @Param("q") String q,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow
    );
}
