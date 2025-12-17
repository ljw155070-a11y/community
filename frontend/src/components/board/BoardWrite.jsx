import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./boardwrite.css";

const BoardWrite = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(""); // 처음엔 비워두고 API로 채움
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACK_SERVER}/category/list`
        );

        const list = res?.data?.list ?? [];
        setCategories(list);

        // 기본 선택값: 첫 번째 카테고리
        if (list.length > 0) {
          setCategoryId(list[0].categoryId);
        }
      } catch (e) {
        console.error(e);
        alert("카테고리 목록을 불러오지 못했습니다.");
      }
    };

    fetchCategories();
  }, []);

  const submitPost = async () => {
    if (!categoryId) return alert("카테고리를 선택해주세요.");
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!content.trim()) return alert("내용을 입력해주세요.");

    try {
      setLoading(true);

      // ✅ JWT 완료 전 임시 authorId
      //    JWT 완료되면 이 필드 자체를 보내지 않는 게 정석이고,
      //    백엔드에서 토큰으로 authorId를 세팅하도록 바꿔.
      const authorId = 1;

      const res = await axios.post(
        `${import.meta.env.VITE_BACK_SERVER}/post/write`,
        {
          categoryId: Number(categoryId),
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
    <div className="bw-wrap">
      <div className="bw-page">
        <div className="bw-top">
          <button
            className="bw-back"
            type="button"
            onClick={() => navigate(-1)}
          >
            <span className="bw-back-icon" aria-hidden="true">
              ←
            </span>
            <span>뒤로가기</span>
          </button>
        </div>

        <h1 className="bw-title">글쓰기</h1>

        <div className="bw-card">
          <div className="bw-field">
            <label className="bw-label">카테고리</label>
            <select
              className="bw-control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={categories.length === 0}
            >
              {categories.length === 0 ? (
                <option value="">카테고리 불러오는 중...</option>
              ) : (
                categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))
              )}
            </select>
          </div>

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

          <div className="bw-field">
            <label className="bw-label">내용</label>
            <textarea
              className="bw-control bw-textarea"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div
            className="bw-guide"
            role="note"
            aria-label="커뮤니티 가이드 안내"
          >
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
    </div>
  );
};

export default BoardWrite;
