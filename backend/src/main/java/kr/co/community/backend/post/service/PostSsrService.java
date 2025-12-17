package kr.co.community.backend.post.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.post.dao.PostSsrDao;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.dto.PostListDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostSsrService {

    private final PostSsrDao postSsrDao;

    // ✅ 활성 카테고리
    public List<BoardCategoryDTO> getActiveCategories() {
        return postSsrDao.selectActiveCategories();
    }

    // ✅ SSR 게시판 목록
    public Map<String, Object> getPostList(
            Long categoryId,
            String q,
            String sort,
            int page,
            int size
    ) {
        if (page < 1) page = 1;

        int total = postSsrDao.countPostList(categoryId, q);

        int offset = (page - 1) * size;
        int startRow = offset + 1;
        int endRow = offset + size;

        List<PostListDTO> posts =
                postSsrDao.selectPostList(categoryId, q, startRow, endRow);

        int totalPages = (int) Math.ceil((double) total / size);

        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts);      // ✅ 컨트롤러에서 기대하는 이름
        result.put("page", page);
        result.put("totalPages", totalPages);
        result.put("total", total);

        return result;
    }


}
