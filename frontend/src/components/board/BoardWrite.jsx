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

  const TITLE_MAX = 200; // ⭐ 제목 최대 글자수
  const CONTENT_MAX = 4000; // ⭐ 본문 최대 글자수

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

  // ⭐ 본문 텍스트 합치기
  const contentTextForSearch = useMemo(() => {
    return blocks
      .filter((b) => b.type === "text")
      .map((b) => (b.text || "").trim())
      .filter(Boolean)
      .join("\n\n");
  }, [blocks]);

  // ⭐ 제목 글자수
  const titleLen = title.length;
  const titleRemain = TITLE_MAX - titleLen;
  const isTitleOver = titleRemain < 0;

  // ⭐ 본문 글자수
  const contentLen = contentTextForSearch.length;
  const contentRemain = CONTENT_MAX - contentLen;
  const isContentOver = contentRemain < 0;

  const validate = async () => {
    if (!categoryId) return swalWarn("입력 확인", "카테고리를 선택해주세요.");
    if (!title.trim()) return swalWarn("입력 확인", "제목을 입력해주세요.");

    if (isTitleOver) {
      return swalWarn(
        "입력 확인",
        `제목은 ${TITLE_MAX}자 이내로 입력해주세요. (현재 ${titleLen}자)`
      );
    }

    const hasAnyText = blocks.some(
      (b) => b.type === "text" && (b.text || "").trim()
    );
    const hasAnyImage = blocks.some((b) => b.type === "image");
    if (!hasAnyText && !hasAnyImage) {
      return swalWarn(
        "입력 확인",
        "본문(글 또는 이미지)을 1개 이상 넣어주세요."
      );
    }

    if (isContentOver) {
      return swalWarn(
        "입력 확인",
        `본문은 ${CONTENT_MAX}자 이내로 입력해주세요. (현재 ${contentLen}자)`
      );
    }

    return true;
  };

  const submitPost = async () => {
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

      const newImageBlocks = blocks.filter(
        (b) => b.type === "image" && b.kind === "new"
      );
      const filesInOrder = newImageBlocks.map((b) => b.file);

      let fileIndex = 0;
      const blocksMeta = blocks.map((b) => {
        if (b.type === "text") return { type: "text", text: b.text };
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
        title: title.slice(0, TITLE_MAX), // ⭐ 안전장치
        content: contentTextForSearch.slice(0, CONTENT_MAX), // ⭐ 안전장치
        blocksMeta: JSON.stringify(blocksMeta),
      };

      const fd = new FormData();
      fd.append("post", JSON.stringify(postPayload));
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
          {/* ⭐ 제목 */}
          <div className="bw-field">
            <label className="bw-label">
              제목
              <span className={`bw-counter ${isTitleOver ? "over" : ""}`}>
                {isTitleOver
                  ? `초과 ${Math.abs(
                      titleRemain
                    )}자 (현재 ${titleLen}/${TITLE_MAX})`
                  : `남은 ${titleRemain}자 (현재 ${titleLen}/${TITLE_MAX})`}
              </span>
            </label>
            <input
              className="bw-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* ⭐ 본문 */}
          <div className="bw-field">
            <label className="bw-label">
              본문
              <span className={`bw-counter ${isContentOver ? "over" : ""}`}>
                {isContentOver
                  ? `초과 ${Math.abs(
                      contentRemain
                    )}자 (현재 ${contentLen}/${CONTENT_MAX})`
                  : `남은 ${contentRemain}자 (현재 ${contentLen}/${CONTENT_MAX})`}
              </span>
            </label>

            <PostBlocksEditor blocks={blocks} setBlocks={setBlocks} />

            {isContentOver && (
              <div className="bw-counter-help">
                본문은 최대 {CONTENT_MAX}자까지 입력할 수 있습니다.
              </div>
            )}
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
              disabled={loading || isTitleOver || isContentOver}
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
