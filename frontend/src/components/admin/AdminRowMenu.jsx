import React, { useEffect, useRef, useState } from "react";
import "./adminPages.css";

export default function AdminRowMenu({ items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="ap-menu" ref={ref}>
      <button
        className="ap-menu-btn"
        onClick={() => setOpen((v) => !v)}
        title="메뉴"
      >
        ⋮
      </button>

      {open && (
        <div className="ap-menu-pop">
          {items.map((it, idx) => (
            <button
              key={idx}
              className={`ap-menu-item ${it.danger ? "danger" : ""}`}
              onClick={() => {
                setOpen(false);
                it.onClick?.();
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
