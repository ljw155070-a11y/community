import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loginUserState } from "../utils/authState";
import "./boardwrite.css";

const BoardWrite = () => {
  const navigate = useNavigate();
  const loginUser = useRecoilValue(loginUserState);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 로그인 체크
  useEffect(() => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [loginUser, navigate]);

  // ✅ 카테고리 목록
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACK_SERVER}/category/list`,
          { withCredentials: true }
        );

        const list = res?.data?.list ?? [];
        setCategories(list);

        if (list.length > 0) setCategoryId(list[0].categoryId);
      } catch (e) {
        console.error(e);
        alert("카테고리 목록을 불러오지 못했습니다.");
      }
    };

    fetchCategories();
  }, []);

  const submitPost = async () => {
    if (!loginUser) return;
    if (!categoryId) return alert("카테고리를 선택해주세요.");
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!content.trim()) return alert("내용을 입력해주세요.");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACK_SERVER}/post/write`,
        {
          categoryId: Number(categoryId),
          authorId: loginUser.memberId, // ✅ 로그인 사용자
          title,
          content,
        },
        {
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        // ✅ postId 꺼내기 (백엔드 응답 구조가 달라도 대응)
        const postId =
          res?.data?.postId ??
          res?.data?.data?.postId ??
          res?.data?.result?.postId;

        alert("글이 등록되었습니다.");

        if (postId) {
          // ✅ SSR 페이지로 이동은 window.location이 안전함
          window.location.href = `/board/postDetail/${postId}`;
          return;
        }

        // postId가 없으면 일단 목록으로 (백엔드 수정 필요)
        navigate("/board");
      } else {
        alert(res?.data?.message || "글 등록에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("글 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bw-wrap">
      <div className="bw-page">
        <div className="bw-top">
          <button className="bw-back" onClick={() => navigate(-1)}>
            ← 뒤로가기
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="bw-field">
            <label className="bw-label">내용</label>
            <textarea
              className="bw-control bw-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="bw-actions">
            <button
              className="bw-btn bw-btn-ghost"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button
              className="bw-btn bw-btn-primary"
              onClick={submitPost}
              disabled={loading}
            >
              {loading ? "작성 중..." : "작성하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardWrite;
