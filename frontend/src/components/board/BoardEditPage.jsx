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

  const fileUrl = (saveName) =>
    BACK ? `${BACK}/uploads/${saveName}` : `/uploads/${saveName}`;

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
        const images = post?.images ?? [];

        if (serverBlocksMeta) {
          const meta =
            typeof serverBlocksMeta === "string"
              ? JSON.parse(serverBlocksMeta)
              : serverBlocksMeta;

          const rebuilt = meta.map((m) => {
            if (m.type === "text")
              return { id: uid(), type: "text", text: m.text || "" };

            // image saved
            if (m.type === "image" && (m.imgId || m.saveName)) {
              return {
                id: uid(),
                type: "image",
                kind: "saved",
                imgId: m.imgId,
                saveName: m.saveName,
                origName: m.origName,
                url: m.saveName ? fileUrl(m.saveName) : "",
              };
            }

            return { id: uid(), type: "text", text: "" };
          });

          setBlocks(
            rebuilt.length
              ? rebuilt
              : [{ id: uid(), type: "text", text: post?.content ?? "" }]
          );
        } else {
          // fallback: 텍스트 1개 + 이미지들
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

      // 1) 새 이미지 업로드 (있으면)
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

      // 2) blocksMeta 만들기 (saved는 확정, new는 업로드 후 GET에서 다시 맞춰짐)
      const blocksMeta = blocks.map((b) => {
        if (b.type === "text") return { type: "text", text: b.text };
        if (b.kind === "saved") {
          return {
            type: "image",
            kind: "saved",
            imgId: b.imgId,
            saveName: b.saveName,
            origName: b.origName,
          };
        }
        // new
        return { type: "image", kind: "new", origName: b.origName };
      });

      // 3) PUT 저장 (blocksMeta 저장이 핵심)
      await axios.put(
        `${BACK}/post/${postId}`,
        {
          postId: Number(postId),
          categoryId: categoryId ? Number(categoryId) : null,
          title,
          content: contentTextForSearch,
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
            <label className="bw-label">본문 (글+이미지 섞기)</label>
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

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
