import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginUserState } from "../utils/authState";
import { getCurrentUserAPI } from "../utils/authUtils";
import PostBlocksEditor from "./PostBlocksEditor";
import "./boardwrite.css";

export default function BoardWrite() {
  const navigate = useNavigate();
  const loginUser = useRecoilValue(loginUserState);
  const setLoginUser = useSetRecoilState(loginUserState);

  const BACK = (import.meta.env.VITE_BACK_SERVER || "").replace(/\/$/, "");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([
    { id: "init-" + Date.now(), type: "text", text: "" },
  ]);

  const [loading, setLoading] = useState(false);

  const swalWarn = (t, x) =>
    Swal.fire({
      icon: "warning",
      title: t,
      text: x,
      confirmButtonText: "확인",
    });
  const swalError = (t, x) =>
    Swal.fire({ icon: "error", title: t, text: x, confirmButtonText: "확인" });
  const swalSuccess = (t, x) =>
    Swal.fire({
      icon: "success",
      title: t,
      text: x,
      confirmButtonText: "확인",
    });

  // 로그인 복구
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (loginUser) return;

      const me = await getCurrentUserAPI();
      if (!mounted) return;

      if (me) {
        setLoginUser(me);
        return;
      }

      await Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다.",
        text: "로그인 페이지로 이동합니다.",
        confirmButtonText: "확인",
      });
      navigate("/login");
    })();

    return () => {
      mounted = false;
    };
  }, [loginUser, navigate, setLoginUser]);

  // 카테고리
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BACK}/category/list`, {
          withCredentials: true,
        });
        const list = res?.data?.list ?? [];
        setCategories(list);
        if (list.length > 0) setCategoryId(list[0].categoryId);
      } catch (e) {
        console.error(e);
        await swalError(
          "불러오기 실패",
          "카테고리 목록을 불러오지 못했습니다."
        );
      }
    })();
  }, [BACK]);

  const contentTextForSearch = useMemo(() => {
    return blocks
      .filter((b) => b.type === "text")
      .map((b) => (b.text || "").trim())
      .filter(Boolean)
      .join("\n\n");
  }, [blocks]);

  const validate = async () => {
    if (!categoryId) return swalWarn("입력 확인", "카테고리를 선택해주세요.");
    if (!title.trim()) return swalWarn("입력 확인", "제목을 입력해주세요.");

    const hasAnyText = blocks.some((b) => b.type === "text" && b.text.trim());
    const hasAnyImage = blocks.some((b) => b.type === "image");
    if (!hasAnyText && !hasAnyImage) {
      return swalWarn(
        "입력 확인",
        "본문(글 또는 이미지)을 1개 이상 넣어주세요."
      );
    }
    return true;
  };

  const submitPost = async () => {
    // 로그인 보장
    let user = loginUser;
    if (!user) {
      const me = await getCurrentUserAPI();
      if (me) {
        setLoginUser(me);
        user = me;
      }
    }
    if (!user) {
      await Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다.",
        text: "로그인 후 다시 시도해주세요.",
        confirmButtonText: "확인",
      });
      navigate("/login");
      return;
    }

    const ok = await validate();
    if (ok !== true) return;

    try {
      setLoading(true);

      // ✅ 새 이미지들(업로드 순서)
      const newImageBlocks = blocks.filter(
        (b) => b.type === "image" && b.kind === "new"
      );
      const filesInOrder = newImageBlocks.map((b) => b.file);

      // ✅ blocksMeta: image는 files[] index를 참조
      let fileIndex = 0;
      const blocksMeta = blocks.map((b) => {
        if (b.type === "text") return { type: "text", text: b.text };
        // image
        if (b.kind === "new")
          return {
            type: "image",
            kind: "new",
            fileIndex: fileIndex++,
            origName: b.origName,
          };
        return { type: "image", kind: "saved" };
      });

      const postPayload = {
        categoryId: Number(categoryId),
        authorId: user.memberId,
        title,
        content: contentTextForSearch, // 검색/요약용 텍스트만
        blocksMeta: JSON.stringify(blocksMeta), // ✅ DB에 저장할 값
      };

      const fd = new FormData();
      // 백엔드 컨트롤러는 @RequestPart("post") String postJson 형태 → String으로 보냄
      fd.append("post", JSON.stringify(postPayload));
      // 혹시 컨트롤러에서 별도 blocksMeta를 받는 버전이면 같이 보내도 됨(안 받아도 무시됨)
      fd.append("blocksMeta", JSON.stringify(blocksMeta));
      filesInOrder.forEach((f) => fd.append("files", f));

      const res = await axios.post(`${BACK}/post`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        const postId = res?.data?.postId;
        await swalSuccess("등록 완료", "글이 등록되었습니다.");
        if (postId) window.location.href = `/board/postDetail/${postId}`;
        else window.location.href = `/board`;
      } else {
        await swalError(
          "등록 실패",
          res?.data?.message || "글 등록에 실패했습니다."
        );
      }
    } catch (e) {
      console.error(e);
      await swalError("오류", "글 등록 중 오류가 발생했습니다.");
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
            onClick={() => navigate(-1)}
            type="button"
          >
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
            <label className="bw-label">본문 (글+이미지 섞기)</label>
            <PostBlocksEditor blocks={blocks} setBlocks={setBlocks} />
          </div>

          <div className="bw-actions">
            <button
              className="bw-btn bw-btn-ghost"
              onClick={() => navigate(-1)}
              type="button"
            >
              취소
            </button>
            <button
              className="bw-btn bw-btn-primary"
              onClick={submitPost}
              disabled={loading}
              type="button"
            >
              {loading ? "작성 중..." : "작성하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
