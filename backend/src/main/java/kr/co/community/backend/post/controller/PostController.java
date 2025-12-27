package kr.co.community.backend.post.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.service.PostService;

@RestController
@RequestMapping("/post")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final ObjectMapper objectMapper;

    // ✅ 글 단건 조회 (+ 이미지 + blocksMeta 포함)
    @GetMapping("/{postId}")
    public Map<String, Object> detail(@PathVariable Long postId) {
        PostDTO post = postService.getById(postId);
        return Map.of("success", true, "post", post);
    }

    // ✅ 글 생성 (multipart)
    // FormData:
    //  - post: JSON 문자열 (PostDTO)
    //  - files: MultipartFile[] (선택)
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> write(
        @RequestPart("post") String postJson,
        @RequestPart(value = "files", required = false) MultipartFile[] files
    ) throws Exception {

        PostDTO dto = objectMapper.readValue(postJson, PostDTO.class);

        Long postId = postService.writeWithImages(dto, files);

        return Map.of("success", true, "postId", postId);
    }

    // ✅ 글 수정 (JSON)
    // dto 안에 blocksMeta도 같이 넣어서 보내면 DB에 저장됨 (updatePost에 BLOCKS_META 포함되어 있어야 함)
    @PutMapping("/{postId}")
    public Map<String, Object> update(
        @PathVariable Long postId,
        @RequestBody PostDTO dto
    ) {
        dto.setPostId(postId);
        postService.update(dto);
        return Map.of("success", true);
    }

    // ✅ 이미지 추가(여러 장)
    @PostMapping(value = "/{postId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> addImages(
        @PathVariable Long postId,
        @RequestPart(value = "files", required = false) MultipartFile[] files
    ) {
        var inserted = postService.addImages(postId, files);
        return Map.of("success", true, "images", inserted);
    }

    // ✅ 이미지 삭제
    @DeleteMapping("/{postId}/images/{imgId}")
    public Map<String, Object> deleteImage(
        @PathVariable Long postId,
        @PathVariable Long imgId
    ) {
        postService.deleteImage(postId, imgId);
        return Map.of("success", true);
    }
 // ✅ 글 삭제 (소프트 삭제)
    @DeleteMapping("/{postId}")
    public Map<String, Object> delete(@PathVariable Long postId) {
        postService.deletePost(postId);
        return Map.of("success", true);
    }
}
