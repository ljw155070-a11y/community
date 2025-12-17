package kr.co.community.backend.category.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.co.community.backend.category.dto.BoardCategoryDTO;

@Mapper
public interface BoardCategoryDao {
    List<BoardCategoryDTO> selectActiveCategories();
}
