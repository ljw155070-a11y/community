import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./boardedit.css";

export default function BoardEditPage() {
  const { postId } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
  });

  // ✅ 기존 글 조회
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_BACK_SERVER}/post/${postId}`
        );

        const post = res.data.post; // { post: {...} } 형태라고 했으니
        setForm({
          title: post?.title ?? "",
          content: post?.content ?? "",
          categoryId: post?.categoryId ?? "",
        });
      } catch (e) {
        console.error(e);
        alert("게시글을 불러오지 못했습니다.");
        nav("/board");
      } finally {
        setLoading(false);
      }
    })();
  }, [postId, nav]);

  // ✅ 수정
  const onUpdate = async () => {
    if (!form.title.trim()) return alert("제목을 입력하세요.");
    if (!form.content.trim()) return alert("내용을 입력하세요.");

    try {
      setSaving(true);
      await axios.put(
        `${import.meta.env.VITE_BACK_SERVER}/post/${postId}`,
        form
      );
      alert("수정 완료");
      nav("/board");
    } catch (e) {
      console.error(e);
      alert("수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ 삭제
  const onDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;

    try {
      setSaving(true);
      await axios.delete(`${import.meta.env.VITE_BACK_SERVER}/post/${postId}`);
      alert("삭제 완료");
      nav("/board");
    } catch (e) {
      console.error(e);
      alert("삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bw-wrap">
      <div className="bw-page">
        <div className="bw-top">
          <button className="bw-back" onClick={() => nav(-1)} type="button">
            <span className="bw-back-icon">←</span>
            뒤로가기
          </button>
        </div>

        <h1 className="bw-title">게시글 수정</h1>

        <div className="bw-card">
          {loading ? (
            <p className="bw-loading">불러오는 중...</p>
          ) : (
            <>
              <div className="bw-field">
                <label className="bw-label">제목</label>
                <input
                  className="bw-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div className="bw-field">
                <label className="bw-label">내용</label>
                <textarea
                  className="bw-control bw-textarea"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder="내용을 입력하세요"
                />
                <div className="bw-guide">
                  <span className="bw-guide-icon">💡</span>
                  <p className="bw-guide-text">
                    <span className="bw-guide-strong">수정 시 유의사항</span>
                    <span className="bw-guide-sub">
                      욕설/비방/도배는 제재 대상입니다. 내용 확인 후
                      저장해주세요.
                    </span>
                  </p>
                </div>
              </div>

              <div className="bw-actions">
                <button
                  className="bw-btn bw-btn-ghost"
                  type="button"
                  onClick={() => nav("/board")}
                  disabled={saving}
                >
                  취소
                </button>

                <button
                  className="bw-btn bw-btn-danger"
                  type="button"
                  onClick={onDelete}
                  disabled={saving}
                >
                  삭제
                </button>

                <button
                  className="bw-btn bw-btn-primary"
                  type="button"
                  onClick={onUpdate}
                  disabled={saving}
                >
                  {saving ? "저장 중..." : "수정 저장"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
