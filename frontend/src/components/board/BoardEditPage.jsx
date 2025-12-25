import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import PostBlocksEditor from "./PostBlocksEditor";
import "./boardedit.css";

export default function BoardEditPage() {
  const { postId } = useParams();
  const BACK = (import.meta.env.VITE_BACK_SERVER || "").replace(/\/$/, "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [blocks, setBlocks] = useState([]);

  // ✅ 핵심: 이미지 URL은 상대경로로(SSR이랑 동일하게 /uploads/...)
  // (같은 도메인/포트에서 SPA가 붙는 구조면 이게 제일 안정적임)
  const fileUrl = (saveName) => (saveName ? `/uploads/${saveName}` : "");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACK}/post/${postId}`, {
          withCredentials: true,
        });
        const post = res?.data?.post;

        setTitle(post?.title ?? "");
        setCategoryId(post?.categoryId ?? "");

        const serverBlocksMeta = post?.blocksMeta ?? null;
        const images = Array.isArray(post?.images) ? post.images : [];

        // ✅ images를 imgId 기준으로 빠르게 찾기
        const imgById = new Map(images.map((img) => [Number(img.imgId), img]));

        // ✅ 1) blocksMeta 있으면 그걸 기준으로 블록 구성
        if (serverBlocksMeta) {
          const meta =
            typeof serverBlocksMeta === "string"
              ? JSON.parse(serverBlocksMeta)
              : serverBlocksMeta;

          const usedImgIds = new Set();

          const rebuilt = (Array.isArray(meta) ? meta : [])
            .map((m) => {
              if (m?.type === "text") {
                const t = (m.text ?? "").trim();
                // ✅ 찌꺼기 빈 텍스트는 그냥 버리기
                if (!t) return null;
                return { id: uid(), type: "text", text: t };
              }

              if (m?.type === "image") {
                const imgId = m.imgId != null ? Number(m.imgId) : null;
                const found = imgId != null ? imgById.get(imgId) : null;

                const saveName = m.saveName || found?.saveName || "";
                const origName = m.origName || found?.origName || "";

                // ✅ saveName 없으면 이미지 블록 자체 버림(= 찌꺼기 제거)
                if (!saveName) return null;

                if (imgId != null) usedImgIds.add(imgId);
                if (found?.imgId != null) usedImgIds.add(Number(found.imgId));

                return {
                  id: uid(),
                  type: "image",
                  kind: "saved",
                  imgId: imgId ?? Number(found?.imgId),
                  saveName,
                  origName,
                  url: fileUrl(saveName),
                };
              }

              return null;
            })
            .filter(Boolean);

          // ✅ 2) blocksMeta에 없는 “남은 이미지”만 뒤에 붙이기 (중복 방지)
          const restImages = images.filter(
            (img) => !usedImgIds.has(Number(img.imgId))
          );

          restImages.forEach((img) => {
            if (!img?.saveName) return;
            rebuilt.push({
              id: uid(),
              type: "image",
              kind: "saved",
              imgId: Number(img.imgId),
              saveName: img.saveName,
              origName: img.origName,
              url: fileUrl(img.saveName),
            });
          });

          // ✅ 3) 결과가 비면 기본 텍스트 1개
          setBlocks(
            rebuilt.length
              ? rebuilt
              : [{ id: uid(), type: "text", text: post?.content ?? "" }]
          );
        } else {
          // ✅ blocksMeta 없으면 (구버전 글) : 텍스트 1개 + 이미지들
          const base = [{ id: uid(), type: "text", text: post?.content ?? "" }];
          images.forEach((img) => {
            if (!img?.saveName) return;
            base.push({
              id: uid(),
              type: "image",
              kind: "saved",
              imgId: Number(img.imgId),
              saveName: img.saveName,
              origName: img.origName,
              url: fileUrl(img.saveName),
            });
          });
          setBlocks(base);
        }
      } catch (e) {
        console.error(e);
        await Swal.fire({
          icon: "error",
          title: "불러오기 실패",
          text: "게시글을 불러오지 못했습니다.",
        });
        window.location.href = "/board";
      } finally {
        setLoading(false);
      }
    })();
  }, [BACK, postId]);

  const contentTextForSearch = useMemo(() => {
    return blocks
      .filter((b) => b.type === "text")
      .map((b) => (b.text || "").trim())
      .filter(Boolean)
      .join("\n\n");
  }, [blocks]);

  const onDeleteSavedImage = async (imgId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "이미지를 삭제할까요?",
      text: "삭제된 이미지는 복구할 수 없습니다.",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });
    if (!result.isConfirmed) return false;

    try {
      await axios.delete(`${BACK}/post/${postId}/images/${imgId}`, {
        withCredentials: true,
      });
      await Swal.fire({
        icon: "success",
        title: "삭제 완료",
        confirmButtonText: "확인",
      });
      return true;
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: "이미지 삭제 중 오류가 발생했습니다.",
      });
      return false;
    }
  };

  const onUpdate = async () => {
    if (!title.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "제목이 비어있어요",
        text: "제목을 입력해주세요.",
      });
      return;
    }

    const hasAnyText = blocks.some((b) => b.type === "text" && b.text.trim());
    const hasAnyImage = blocks.some((b) => b.type === "image");
    if (!hasAnyText && !hasAnyImage) {
      await Swal.fire({
        icon: "warning",
        title: "본문이 비어있어요",
        text: "글 또는 이미지를 1개 이상 넣어주세요.",
      });
      return;
    }

    try {
      setSaving(true);

      // 1) 새 이미지 업로드
      const newImages = blocks.filter(
        (b) => b.type === "image" && b.kind === "new"
      );
      if (newImages.length > 0) {
        const fd = new FormData();
        newImages.forEach((b) => fd.append("files", b.file));
        await axios.post(`${BACK}/post/${postId}/images`, fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 2) blocksMeta 생성
      // ✅ saved는 imgId/saveName/origName 반드시 넣는다
      // ✅ new는 업로드 후에는 실제로 DB에 들어가므로, 원칙적으로는 저장 전에 다시 GET해서 붙이는 게 제일 깔끔하지만
      //    지금은 최소 변경으로: new는 meta에 남겨두지 않고(또는 텍스트만 저장) -> 다음 GET 때 images로 보강되도록 한다.
      const blocksMeta = blocks
        .filter((b) => !(b.type === "image" && b.kind === "new")) // ✅ new 이미지는 meta에 남기지 않음(중복/빈 url 방지)
        .map((b) => {
          if (b.type === "text") return { type: "text", text: b.text };
          // saved
          return {
            type: "image",
            kind: "saved",
            imgId: b.imgId,
            saveName: b.saveName,
            origName: b.origName,
          };
        });

      // 3) PUT 저장
      await axios.put(
        `${BACK}/post/${postId}`,
        {
          postId: Number(postId),
          categoryId: categoryId ? Number(categoryId) : null,
          title,
          content: contentTextForSearch || " ", // ✅ 비어있으면 서버 validation 걸릴 수 있어서 안전하게
          blocksMeta: JSON.stringify(blocksMeta),
        },
        { withCredentials: true }
      );

      await Swal.fire({
        icon: "success",
        title: "수정 완료",
        confirmButtonText: "확인",
      });
      window.location.href = `/board/postDetail/${postId}`;
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "수정 실패",
        text: "게시글 수정 중 오류가 발생했습니다.",
      });
    } finally {
      setSaving(false);
    }
  };

  const onDeletePost = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "정말 삭제할까요?",
      text: "삭제된 게시글은 복구할 수 없습니다.",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });
    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      await axios.delete(`${BACK}/post/${postId}`, { withCredentials: true });
      await Swal.fire({
        icon: "success",
        title: "삭제 완료",
        confirmButtonText: "확인",
      });
      window.location.href = "/board";
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: "게시글 삭제 중 오류가 발생했습니다.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bw-wrap">
        <div className="bw-page">
          <div className="bw-card">
            <p className="bw-loading">불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bw-wrap">
      <div className="bw-page">
        <div className="bw-top">
          <button
            className="bw-back"
            onClick={() => window.history.back()}
            type="button"
          >
            ← 뒤로가기
          </button>
        </div>

        <h1 className="bw-title">게시글 수정</h1>

        <div className="bw-card">
          <div className="bw-field">
            <label className="bw-label">제목</label>
            <input
              className="bw-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="bw-field">
            <label className="bw-label">본문</label>
            <PostBlocksEditor
              blocks={blocks}
              setBlocks={setBlocks}
              onDeleteSavedImage={onDeleteSavedImage}
            />
          </div>

          <div className="bw-actions">
            <button
              className="bw-btn bw-btn-ghost"
              type="button"
              onClick={() =>
                (window.location.href = `/board/postDetail/${postId}`)
              }
              disabled={saving}
            >
              취소
            </button>

            <button
              className="bw-btn bw-btn-danger"
              type="button"
              onClick={onDeletePost}
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
        </div>
      </div>
    </div>
  );
}

function buildFallbackBlocks(post, images, fileUrl) {
  const base = [{ id: uid(), type: "text", text: post?.content ?? "" }];
  images.forEach((img) => {
    base.push({
      id: uid(),
      type: "image",
      kind: "saved",
      imgId: img.imgId,
      saveName: img.saveName,
      origName: img.origName,
      url: fileUrl(img.saveName),
    });
  });
  return base;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
