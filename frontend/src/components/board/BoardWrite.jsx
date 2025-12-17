import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./boardwrite.css"; // 파일명/대소문자 실제 파일과 완전 동일해야 함

const BoardWrite = () => {
  const navigate = useNavigate();

  // ✅ DB는 CATEGORY_ID라서 숫자로 관리하는 게 정석
  const [categoryId, setCategoryId] = useState(1); // 1: 자유, 2: 공지(예시)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submitPost = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!content.trim()) return alert("내용을 입력해주세요.");

    try {
      setLoading(true);

      // ✅ 로그인 붙이기 전 임시 authorId
      //    (나중에 JWT 붙으면 여기에서 빼고 백엔드에서 인증정보로 처리)
      const authorId = 1;

      // ✅ 백엔드: POST http://localhost:9999/post/write
      // ✅ DTO: categoryId, authorId, title, content
      const res = await axios.post(
        `${import.meta.env.VITE_BACK_SERVER}/post/write`,
        {
          categoryId,
          authorId,
          title,
          content,
        }
      );

      if (res?.data?.success) {
        alert("글이 등록되었습니다.");
        navigate("/board");
      } else {
        alert("글 등록에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bw-page">
      {/* 상단: 뒤로가기 */}
      <div className="bw-top">
        <button className="bw-back" type="button" onClick={() => navigate(-1)}>
          <span className="bw-back-icon" aria-hidden="true">
            ←
          </span>
          <span>뒤로가기</span>
        </button>
      </div>

      {/* 타이틀 */}
      <h1 className="bw-title">글쓰기</h1>

      {/* 카드 */}
      <div className="bw-card">
        {/* 카테고리 */}
        <div className="bw-field">
          <label className="bw-label">카테고리</label>
          <select
            className="bw-control"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {/* ✅ 여기 숫자는 너 DB의 CATEGORY 테이블/코드에 맞춰서 수정 */}
            <option value={1}>자유</option>
            <option value={2}>공지</option>
          </select>
        </div>

        {/* 제목 */}
        <div className="bw-field">
          <label className="bw-label">제목</label>
          <input
            className="bw-control"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div className="bw-field">
          <label className="bw-label">내용</label>
          <textarea
            className="bw-control bw-textarea"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 가이드 박스 */}
        <div className="bw-guide" role="note" aria-label="커뮤니티 가이드 안내">
          <span className="bw-guide-icon" aria-hidden="true">
            💡
          </span>
          <p className="bw-guide-text">
            <span className="bw-guide-strong">
              커뮤니티 가이드를 준수하여 작성해주세요.
            </span>
            <span className="bw-guide-sub">
              타인을 비방하거나 불쾌감을 주는 내용은 삭제될 수 있습니다.
            </span>
          </p>
        </div>

        {/* 버튼 */}
        <div className="bw-actions">
          <button
            className="bw-btn bw-btn-ghost"
            type="button"
            onClick={() => navigate(-1)}
          >
            취소
          </button>

          <button
            className="bw-btn bw-btn-primary"
            type="button"
            onClick={submitPost}
            disabled={loading}
          >
            <span className="bw-btn-icon" aria-hidden="true">
              📝
            </span>
            {loading ? "작성 중..." : "작성하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardWrite;
