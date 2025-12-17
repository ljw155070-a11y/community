package kr.co.community.backend.post.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.service.PostService;

@CrossOrigin("*")
@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    // ✅ 글 등록
    // POST http://localhost:9999/post/write
    @PostMapping("/write")
    public Map<String, Object> write(@RequestBody PostDTO dto) {
    	System.out.println(dto);
        Long postId = postService.write(dto);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("postId", postId);
        return result;
    }
}
