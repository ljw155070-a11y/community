package kr.co.community.backend.post.service;

import java.nio.file.*;
import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import kr.co.community.backend.post.dao.PostDao;
import kr.co.community.backend.post.dto.PostDTO;
import kr.co.community.backend.post.dto.PostImageDTO;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostDao postDao;

    private final Path uploadDir = Paths.get("C:/uploads/community");

    // ✅ 글 생성 (텍스트만)
    public Long write(PostDTO dto) {
        if (dto == null) throw new IllegalArgumentException("요청 데이터가 비어있습니다.");
        if (dto.getCategoryId() == null) throw new IllegalArgumentException("categoryId는 필수입니다.");
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) throw new IllegalArgumentException("title은 필수입니다.");
        if (dto.getContent() == null || dto.getContent().trim().isEmpty()) throw new IllegalArgumentException("content는 필수입니다.");

        // 임시
        if (dto.getAuthorId() == null) dto.setAuthorId(1L);

        if (dto.getViewCount() == null) dto.setViewCount(0);
        if (dto.getLikeCount() == null) dto.setLikeCount(0);
        if (dto.getCommentCount() == null) dto.setCommentCount(0);
        if (dto.getIsDeleted() == null || dto.getIsDeleted().isBlank()) dto.setIsDeleted("N");

        int rows = postDao.insertPost(dto);
        if (rows != 1) throw new RuntimeException("게시글 등록 실패");

        return postDao.selectPostSeqCurrval();
    }

    // ✅ 글 + 이미지 한번에 저장 (컨트롤러에서 호출)
    public Long writeWithImages(PostDTO dto, MultipartFile[] files) {
        Long postId = write(dto);
        addImages(postId, files); // ✅ 이미지 저장 재사용
        return postId;
    }

    public PostDTO getById(Long postId) {
        if (postId == null) throw new IllegalArgumentException("postId는 필수입니다.");

        PostDTO post = postDao.selectPostById(postId);
        if (post == null) throw new RuntimeException("게시글이 존재하지 않습니다.");

        // ✅ 이미지도 같이
        post.setImages(postDao.selectImagesByPostId(postId));
        return post;
    }

    public void update(PostDTO dto) {
        if (dto == null) throw new IllegalArgumentException("요청 데이터가 비어있습니다.");
        if (dto.getPostId() == null) throw new IllegalArgumentException("postId는 필수입니다.");
        if (dto.getCategoryId() == null) throw new IllegalArgumentException("categoryId는 필수입니다.");
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) throw new IllegalArgumentException("title은 필수입니다.");
        if (dto.getContent() == null || dto.getContent().trim().isEmpty()) throw new IllegalArgumentException("content는 필수입니다.");

        int rows = postDao.updatePost(dto);
        if (rows != 1) throw new RuntimeException("게시글 수정 실패");
    }

    // ✅ 이미지 추가 (여러 장) + 프론트가 즉시 쓰게 반환
    public List<PostImageDTO> addImages(Long postId, MultipartFile[] files) {
        if (postId == null) throw new IllegalArgumentException("postId 필수");
        if (files == null || files.length == 0) return List.of();

        try {
            Files.createDirectories(uploadDir);
        } catch (Exception e) {
            throw new RuntimeException("업로드 폴더 생성 실패", e);
        }

        int baseSort = Optional.ofNullable(postDao.selectMaxSortNo(postId)).orElse(-1) + 1;

        List<PostImageDTO> inserted = new ArrayList<>();
        int sort = baseSort;

        for (MultipartFile f : files) {
            if (f == null || f.isEmpty()) continue;

            String orig = f.getOriginalFilename();
            String ext = (orig != null && orig.contains(".")) ? orig.substring(orig.lastIndexOf(".")) : "";
            String save = UUID.randomUUID().toString().replace("-", "") + ext;

            Path target = uploadDir.resolve(save);
            try {
                f.transferTo(target.toFile());
            } catch (Exception e) {
                throw new RuntimeException("파일 저장 실패", e);
            }

            postDao.insertPostImage(
                postId,
                orig,
                save,
                f.getContentType(),
                f.getSize(),
                sort
            );

            PostImageDTO dto = new PostImageDTO();
            dto.setPostId(postId);
            dto.setOrigName(orig);
            dto.setSaveName(save);
            dto.setContentType(f.getContentType());
            dto.setFileSize(f.getSize());
            dto.setSortNo(sort);

            inserted.add(dto);
            sort++;
        }

        return inserted;
    }

    public void deleteImage(Long postId, Long imgId) {
        if (postId == null || imgId == null) throw new IllegalArgumentException("postId/imgId 필수");

        PostImageDTO img = postDao.selectImageByImgId(imgId);
        if (img == null) throw new RuntimeException("이미지가 존재하지 않습니다.");
        if (!Objects.equals(img.getPostId(), postId)) throw new RuntimeException("잘못된 요청입니다.");

        int rows = postDao.deletePostImage(imgId);
        if (rows != 1) throw new RuntimeException("이미지 삭제 실패");

        try {
            Files.deleteIfExists(uploadDir.resolve(img.getSaveName()));
        } catch (Exception ignored) {}
    }
}
