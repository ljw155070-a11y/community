package kr.co.community.backend.category.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.community.backend.category.dao.BoardCategoryDao;
import kr.co.community.backend.category.dto.BoardCategoryDTO;

@Service
public class BoardCategoryService {

    @Autowired
    private BoardCategoryDao boardCategoryDao;

    public List<BoardCategoryDTO> getActiveCategories() {
        return boardCategoryDao.selectActiveCategories();
    }
}
