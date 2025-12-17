package kr.co.community.backend.post.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.community.backend.post.dao.PostDao;
import kr.co.community.backend.post.dto.PostDTO;

@Service
public class PostService {

    @Autowired
    private PostDao postDao;

    public Long write(PostDTO dto) {

        if (dto == null) throw new IllegalArgumentException("요청 데이터가 비어있습니다.");
        if (dto.getCategoryId() == null) throw new IllegalArgumentException("categoryId는 필수입니다.");
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) throw new IllegalArgumentException("title은 필수입니다.");
        if (dto.getContent() == null || dto.getContent().trim().isEmpty()) throw new IllegalArgumentException("content는 필수입니다.");

        // ✅ JWT 완료 전 임시 처리(개발용)
        if (dto.getAuthorId() == null) {
            dto.setAuthorId(1L); // ⚠️ DB에 실제로 존재하는 회원 ID여야 함
        }

        if (dto.getViewCount() == null) dto.setViewCount(0);
        if (dto.getLikeCount() == null) dto.setLikeCount(0);
        if (dto.getCommentCount() == null) dto.setCommentCount(0);
        if (dto.getIsDeleted() == null || dto.getIsDeleted().trim().isEmpty()) dto.setIsDeleted("N");

        int rows = postDao.insertPost(dto);
        if (rows != 1) throw new RuntimeException("게시글 등록 실패");

        return postDao.selectPostSeqCurrval();
    }

    public PostDTO getById(Long postId) {
        if (postId == null) throw new IllegalArgumentException("postId는 필수입니다.");
        PostDTO post = postDao.selectPostById(postId);
        if (post == null) throw new RuntimeException("게시글이 존재하지 않습니다.");
        return post;
    }
    // ✅ 글 수정
    public void update(PostDTO dto) {
        if (dto == null) throw new IllegalArgumentException("요청 데이터가 비어있습니다.");
        if (dto.getPostId() == null) throw new IllegalArgumentException("postId는 필수입니다.");
        if (dto.getCategoryId() == null) throw new IllegalArgumentException("categoryId는 필수입니다.");
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) throw new IllegalArgumentException("title은 필수입니다.");
        if (dto.getContent() == null || dto.getContent().trim().isEmpty()) throw new IllegalArgumentException("content는 필수입니다.");

        int rows = postDao.updatePost(dto);
        if (rows != 1) throw new RuntimeException("게시글 수정 실패(존재하지 않거나 삭제된 글)");
    }

    // ✅ 글 삭제(소프트 삭제)
    public void delete(Long postId) {
        if (postId == null) throw new IllegalArgumentException("postId는 필수입니다.");

        int rows = postDao.deletePost(postId);
        if (rows != 1) throw new RuntimeException("게시글 삭제 실패(존재하지 않거나 이미 삭제됨)");
    }
}
