package kr.co.community.backend.category.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import kr.co.community.backend.category.dto.BoardCategoryDTO;
import kr.co.community.backend.category.service.BoardCategoryService;

@CrossOrigin("*")
@RestController
@RequestMapping("/category")
public class BoardCategoryController {

    @Autowired
    private BoardCategoryService boardCategoryService;

    // GET http://localhost:9999/category/list
    @GetMapping("/list")
    public Map<String, Object> list() {
        List<BoardCategoryDTO> list = boardCategoryService.getActiveCategories();

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("list", list);
        return result;
    }
}
