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
          + 텍스트 추가
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

        <div className="pe-hint">
          이미지는 드래그 앤 드롭으로도 추가할 수 있습니다.
        </div>
      </div>

      <div className="pe-blocks">
        {blocks.map((b, idx) => (
          <div className="pe-block" key={b.id}>
            <div className="pe-block-head">
              <div className="pe-block-type">
                {b.type === "text"
                  ? "텍스트"
                  : b.kind === "saved"
                  ? "이미지"
                  : "새 이미지"}
              </div>

              <div className="pe-block-actions">
                <button
                  className="pe-mini"
                  type="button"
                  disabled={idx === 0}
                  onClick={() => move(idx, idx - 1)}
                  aria-label="위로 이동"
                >
                  ↑
                </button>

                <button
                  className="pe-mini"
                  type="button"
                  disabled={idx === blocks.length - 1}
                  onClick={() => move(idx, idx + 1)}
                  aria-label="아래로 이동"
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
              <div className="pe-text">
                <textarea
                  className="pe-textarea"
                  value={b.text}
                  onChange={(e) => updateText(b.id, e.target.value)}
                  placeholder="내용을 입력하세요."
                />
              </div>
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
                    <span className="pe-badge">등록됨</span>
                  ) : (
                    <span className="pe-badge pe-badge-warn">업로드 대기</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="pe-empty">
            본문이 비어 있습니다. <b>+ 텍스트 추가</b> 또는 <b>+ 이미지 추가</b>
            를 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
