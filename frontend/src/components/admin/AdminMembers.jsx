import React, { useEffect, useState } from "react";
import "./adminPages.css";
import { adminApi } from "../utils/adminApi";

export default function AdminMembers() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      const d = await adminApi.members({ q, status, page, size: 10 });
      setData(d);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
  }, [page]); // page 바뀌면 재조회

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  if (err) return <div className="ap-wrap">에러: {err}</div>;
  if (!data) return <div className="ap-wrap">로딩중...</div>;

  return (
    <div className="ap-wrap">
      <div className="ap-head">
        <h1 className="ap-title">회원 관리</h1>
        <p className="ap-sub">등록된 회원을 조회하고 관리하세요</p>
      </div>

      <form className="ap-toolbar" onSubmit={onSearch}>
        <div className="ap-search">
          <span className="ap-search-ico">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이름 또는 이메일로 검색"
          />
        </div>

        <select
          className="ap-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">전체 상태</option>
          <option value="ACTIVE">활성</option>
          <option value="BANNED">정지</option>
        </select>

        <button className="ap-btn primary" type="submit">
          검색
        </button>
      </form>

      <div className="ap-table">
        {/* 헤더 */}
        <div className="ap-tr ap-th">
          <div>회원 정보</div>
          <div>가입일</div>
          <div>활동</div>
          <div>상태</div>
          <div className="t-right">관리</div>
        </div>

        {/* 바디 */}
        {data.rows.map((m) => (
          <div className="ap-tr" key={m.memberId}>
            <div className="ap-usercell">
              <div className="ap-user-name">{m.name}</div>
              <div className="ap-user-email">{m.email}</div>
            </div>

            <div>{String(m.createdAt).slice(0, 10)}</div>

            <div className="ap-activitycell">
              게시글: {m.postCount} <br />
              댓글: {m.commentCount}
            </div>

            <div>
              <span
                className={
                  "ap-pill " +
                  (m.status === "ACTIVE"
                    ? "ok"
                    : m.status === "BANNED"
                    ? "ban"
                    : "warn")
                }
              >
                {m.status}
              </span>
            </div>

            <div className="t-right">
              <div className="ap-menu">
                <button type="button" className="ap-menu-btn">
                  ⋯
                </button>
                {/* 메뉴 팝업은 상태로 열고 닫는 로직 붙일 때 ap-menu-pop / ap-menu-item 쓰면 됨 */}
              </div>
            </div>
          </div>
        ))}

        {/* 푸터 */}
        <div className="ap-pager">
          <button
            type="button"
            className="ap-page"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            이전
          </button>

          {Array.from({ length: data.totalPages })
            .slice(Math.max(0, page - 3), Math.min(data.totalPages, page + 2))
            .map((_, idx) => {
              const p = Math.max(1, page - 2) + idx;
              return (
                <button
                  key={p}
                  type="button"
                  className={"ap-page " + (p === page ? "active" : "")}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}

          <button
            type="button"
            className="ap-page"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
