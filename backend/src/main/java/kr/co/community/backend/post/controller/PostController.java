package kr.co.community.backend.post.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.service.PostService;

@RestController
@RequestMapping("/post")
@CrossOrigin("*")
public class PostController {

	@Autowired
	private PostService postService;

	// ✅ 글 단건 조회 (CSR 수정폼에서 사용)
	@GetMapping("/{postId}")
	public Map<String, Object> detail(@PathVariable Long postId) {
		PostDTO post = postService.getById(postId);
		return Map.of("success", true, "post", post);
	}

	// ✅ 글 등록 (CSR)
	@PostMapping("/write")
	public Map<String, Object> write(@RequestBody PostDTO dto) {
		Long postId = postService.write(dto);

		return Map.of("success", true, "postId", postId);
	}

	// ✅ 글 수정 (CSR)
	@PutMapping("/{postId}")
	public Map<String, Object> update(@PathVariable Long postId, @RequestBody PostDTO dto) {
		dto.setPostId(postId);
		postService.update(dto);

		return Map.of("success", true);
	}

	// ✅ 글 삭제 (CSR)
	@DeleteMapping("/{postId}")
	public Map<String, Object> delete(@PathVariable Long postId) {
		postService.delete(postId);
		return Map.of("success", true);
	}
	

}
