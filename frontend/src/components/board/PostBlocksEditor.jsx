import { useEffect, useRef } from "react";

/**
 * blocks: [
 *  { id, type:'text', text:'' }
 *  { id, type:'image', kind:'new', file:File, previewUrl:'', origName:'' }
 *  { id, type:'image', kind:'saved', imgId, saveName, origName, url }
 * ]
 */
export default function PostBlocksEditor({
  blocks,
  setBlocks,
  onDeleteSavedImage, // async (imgId)=>boolean
}) {
  const fileInputRef = useRef(null);

  const addTextBlock = () => {
    setBlocks((prev) => [...prev, { id: uid(), type: "text", text: "" }]);
  };

  const addImageFilesAsBlocks = (files) => {
    const imageFiles = Array.from(files || []).filter((f) =>
      (f.type || "").startsWith("image/")
    );
    if (imageFiles.length === 0) return;

    const newBlocks = imageFiles.map((f) => ({
      id: uid(),
      type: "image",
      kind: "new",
      file: f,
      previewUrl: URL.createObjectURL(f),
      origName: f.name,
    }));

    setBlocks((prev) => [...prev, ...newBlocks]);
  };

  const pickImages = () => fileInputRef.current?.click();

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.files?.length)
      addImageFilesAsBlocks(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const updateText = (id, text) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, text } : b)));
  };

  const move = (from, to) => {
    setBlocks((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const removeBlock = async (block) => {
    if (block.type !== "image") {
      setBlocks((prev) => prev.filter((b) => b.id !== block.id));
      return;
    }

    if (block.kind === "new") {
      try {
        if (block.previewUrl) URL.revokeObjectURL(block.previewUrl);
      } catch {}
      setBlocks((prev) => prev.filter((b) => b.id !== block.id));
      return;
    }

    if (block.kind === "saved") {
      if (!onDeleteSavedImage) return;
      const ok = await onDeleteSavedImage(block.imgId);
      if (ok) setBlocks((prev) => prev.filter((b) => b.id !== block.id));
    }
  };

  useEffect(() => {
    return () => {
      blocks.forEach((b) => {
        if (b.type === "image" && b.kind === "new" && b.previewUrl) {
          try {
            URL.revokeObjectURL(b.previewUrl);
          } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pe-editor" onDrop={onDrop} onDragOver={onDragOver}>
      <div className="pe-toolbar">
        <button className="pe-btn" type="button" onClick={addTextBlock}>
          + 글 블록
        </button>
        <button
          className="pe-btn pe-btn-primary"
          type="button"
          onClick={pickImages}
        >
          + 이미지 추가
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            addImageFilesAsBlocks(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="pe-hint">이미지는 드래그&드롭도 가능</div>
      </div>

      <div className="pe-dropzone">
        <div className="pe-dropzone-text">
          🖼 이미지를 여기로 드래그하면 바로 추가돼
        </div>
      </div>

      <div className="pe-blocks">
        {blocks.map((b, idx) => (
          <div className="pe-block" key={b.id}>
            <div className="pe-block-head">
              <div className="pe-block-type">
                {b.type === "text"
                  ? "TEXT"
                  : b.kind === "saved"
                  ? "IMAGE"
                  : "NEW IMAGE"}
              </div>

              <div className="pe-block-actions">
                <button
                  className="pe-mini"
                  type="button"
                  disabled={idx === 0}
                  onClick={() => move(idx, idx - 1)}
                >
                  ↑
                </button>
                <button
                  className="pe-mini"
                  type="button"
                  disabled={idx === blocks.length - 1}
                  onClick={() => move(idx, idx + 1)}
                >
                  ↓
                </button>

                <button
                  className="pe-mini pe-mini-danger"
                  type="button"
                  onClick={() => removeBlock(b)}
                >
                  삭제
                </button>
              </div>
            </div>

            {b.type === "text" ? (
              <textarea
                className="pe-textarea"
                value={b.text}
                onChange={(e) => updateText(b.id, e.target.value)}
                placeholder="여기에 글을 입력하세요..."
              />
            ) : (
              <div className="pe-image">
                <img
                  alt={b.origName || "image"}
                  src={b.kind === "new" ? b.previewUrl : b.url}
                />
                <div className="pe-image-meta">
                  <span className="pe-image-name">
                    {b.origName || b.saveName}
                  </span>
                  {b.kind === "saved" ? (
                    <span className="pe-badge">저장됨</span>
                  ) : (
                    <span className="pe-badge pe-badge-warn">업로드 예정</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="pe-empty">
            아직 본문 블록이 없어. <b>+ 글 블록</b>부터 추가해봐.
          </div>
        )}
      </div>
    </div>
  );
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
