import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import PostBlocksEditor from "./PostBlocksEditor";
import "./boardedit.css";

export default function BoardEditPage() {
  const { postId } = useParams();

  // ✅ BACK 비어도 동작하게: 비면 상대경로로 호출(프록시/동일오리진)
  const BACK_RAW = (import.meta.env.VITE_BACK_SERVER || "").replace(/\/$/, "");
  const API = BACK_RAW || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [blocks, setBlocks] = useState([]);

  const fileUrl = (saveName) => (saveName ? `/uploads/${saveName}` : "");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const url = `${API}/post/${postId}`;
        const res = await axios.get(url, { withCredentials: true });

        // ✅ 응답 포맷 방어: {post:...} 또는 {...} 둘 다 수용
        const post = res?.data?.post ?? res?.data ?? null;
        if (!post) throw new Error("post is null");

        setTitle(post?.title ?? "");
        setCategoryId(post?.categoryId ?? "");

        const serverBlocksMeta = post?.blocksMeta ?? null;
        const images = Array.isArray(post?.images) ? post.images : [];

        // ✅ imgId -> image
        const imgById = new Map(
          images
            .filter((img) => img && img.imgId != null)
            .map((img) => [Number(img.imgId), img])
        );

        // ✅ blocksMeta 파싱 (예외 방어)
        let meta = null;
        if (serverBlocksMeta) {
          try {
            meta =
              typeof serverBlocksMeta === "string"
                ? JSON.parse(serverBlocksMeta)
                : serverBlocksMeta;
          } catch (e) {
            console.error("blocksMeta JSON parse fail:", serverBlocksMeta);
            meta = null;
          }
        }

        // ✅ 순서 100% 유지: meta 기준으로만 rebuild (남은 이미지 뒤에 붙이기 X)
        if (Array.isArray(meta) && meta.length > 0) {
          const rebuilt = meta
            .map((m) => metaToBlock(m, imgById, images, fileUrl))
            .filter(Boolean);

          setBlocks(
            rebuilt.length
              ? rebuilt
              : [{ id: uid(), type: "text", text: post?.content ?? "" }]
          );
        } else {
          // ✅ 구버전: content 1개 + images는 SORT_NO 순서대로 뒤에
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
  }, [API, postId]);

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
      await axios.delete(`${API}/post/${postId}/images/${imgId}`, {
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

      // ✅ 1) new 이미지 업로드 → 업로드 결과(저장된 이미지 리스트)를 받아서
      // new 블록을 saved 블록으로 "그 자리 그대로" 치환해야 순서가 유지됨
      const newImageBlocks = blocks.filter(
        (b) => b.type === "image" && b.kind === "new"
      );

      let savedFromUpload = [];
      if (newImageBlocks.length > 0) {
        const fd = new FormData();
        newImageBlocks.forEach((b) => fd.append("files", b.file));

        const upRes = await axios.post(`${API}/post/${postId}/images`, fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        // ✅ 기대 응답: { savedImages: [ {imgId, saveName, origName} ... ] }
        savedFromUpload = Array.isArray(upRes?.data?.savedImages)
          ? upRes.data.savedImages
          : [];

        if (savedFromUpload.length !== newImageBlocks.length) {
          // 업로드 응답이 없거나 개수가 안 맞으면 순서 유지 불가 → 안전하게 안내
          // (그래도 저장은 되겠지만 meta에 new가 남으면 안 됨)
          console.warn(
            "upload response mismatch. savedImages=",
            savedFromUpload
          );
        }
      }

      // ✅ 2) blocks에서 new를 saved로 치환 (업로드 응답이 있을 때만 100% 순서 유지)
      const mergedBlocks = replaceNewImagesInOrder(
        blocks,
        savedFromUpload,
        fileUrl
      );

      // ✅ 3) blocksMeta 생성 (순서 그대로)
      const blocksMeta = mergedBlocks
        .map((b) => {
          if (b.type === "text") return { type: "text", text: b.text };

          // image saved만 저장(여기서 new는 남으면 안 됨)
          if (b.type === "image" && b.kind === "saved" && b.saveName) {
            return {
              type: "image",
              imgId: b.imgId,
              saveName: b.saveName,
              origName: b.origName,
            };
          }
          return null;
        })
        .filter(Boolean);

      // ✅ 4) PUT 저장
      await axios.put(
        `${API}/post/${postId}`,
        {
          postId: Number(postId),
          categoryId: categoryId ? Number(categoryId) : null,
          title,
          content: contentTextForSearch || " ",
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
      await axios.delete(`${API}/post/${postId}`, { withCredentials: true });
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

/** ✅ meta -> block (SSR과 동일하게: saveName → imgId → fileIndex 순으로 보강) */
function metaToBlock(m, imgById, images, fileUrl) {
  if (!m) return null;

  if (m.type === "text") {
    const t = (m.text ?? "").toString();
    if (!t.trim()) return null;
    return { id: uid(), type: "text", text: t };
  }

  if (m.type === "image") {
    const metaSave = (m.saveName ?? "").toString();
    const metaOrig = (m.origName ?? "").toString();

    // 1) saveName이 meta에 있으면 최우선
    if (metaSave.trim()) {
      return {
        id: uid(),
        type: "image",
        kind: "saved",
        imgId: m.imgId != null ? Number(m.imgId) : null,
        saveName: metaSave,
        origName: metaOrig,
        url: fileUrl(metaSave),
      };
    }

    // 2) imgId로 보강
    if (m.imgId != null) {
      const found = imgById.get(Number(m.imgId));
      if (found?.saveName) {
        return {
          id: uid(),
          type: "image",
          kind: "saved",
          imgId: Number(found.imgId),
          saveName: found.saveName,
          origName: metaOrig || found.origName || "",
          url: fileUrl(found.saveName),
        };
      }
    }

    // 3) fileIndex로 보강(구형 메타 대비)
    if (m.fileIndex != null) {
      const idx = Number(m.fileIndex);
      if (idx >= 0 && idx < images.length) {
        const found = images[idx];
        if (found?.saveName) {
          return {
            id: uid(),
            type: "image",
            kind: "saved",
            imgId: Number(found.imgId),
            saveName: found.saveName,
            origName: metaOrig || found.origName || "",
            url: fileUrl(found.saveName),
          };
        }
      }
    }

    // 못 찾으면 스킵(깨진 이미지 방지)
    return null;
  }

  return null;
}

/** ✅ new 이미지들을 업로드 응답 순서대로 "그 자리 그대로" saved로 치환 */
function replaceNewImagesInOrder(blocks, savedImages, fileUrl) {
  if (!Array.isArray(blocks)) return [];
  if (!Array.isArray(savedImages) || savedImages.length === 0) {
    // 업로드 응답이 없으면 new를 meta에 남기면 안 되니까 new는 제거
    // (이 경우 순서 보장 불가)
    return blocks.filter((b) => !(b.type === "image" && b.kind === "new"));
  }

  let i = 0;
  return blocks
    .map((b) => {
      if (b.type === "image" && b.kind === "new") {
        const saved = savedImages[i++];
        if (!saved?.saveName) return null;
        return {
          id: b.id || uid(),
          type: "image",
          kind: "saved",
          imgId: Number(saved.imgId),
          saveName: saved.saveName,
          origName: saved.origName || b.origName || "",
          url: fileUrl(saved.saveName),
        };
      }
      return b;
    })
    .filter(Boolean);
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
