import React, { useMemo, useState } from "react";
import AdminRowMenu from "./AdminRowMenu";
import "./adminPages.css";

const mockPosts = [
  {
    id: 1,
    cat: "자유",
    title: "첫 게시글입니다. 반갑습니다!",
    desc: "안녕하세요. 커뮤니티에 오신 것을 환영합니다. 자유롭게 소통해요!",
    author: "홍길동",
    date: "2024. 12. 10.",
    views: 152,
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    cat: "개발",
    title: "React 개발 팁 공유합니다",
    desc: "useState, useEffect를 활용한 최적화 방법...",
    author: "김개발",
    date: "2024. 12. 11.",
    views: 89,
    likes: 12,
    comments: 23,
  },
  {
    id: 3,
    cat: "일상",
    title: "오늘 점심 뭐 먹을까요?",
    desc: "고민되네요. 추천 좀 해주세요!",
    author: "이맛있",
    date: "2024. 12. 12.",
    views: 215,
    likes: 45,
    comments: 12,
  },
];

export default function AdminPosts() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("전체 카테고리");

  const rows = useMemo(() => {
    return mockPosts.filter((p) => {
      const hit = `${p.title} ${p.desc}`
        .toLowerCase()
        .includes(q.toLowerCase());
      const okCat = cat === "전체 카테고리" ? true : p.cat === cat;
      return hit && okCat;
    });
  }, [q, cat]);

  return (
    <div className="ap-wrap">
      <div className="ap-head">
        <h1 className="ap-title">게시글 관리</h1>
        <p className="ap-sub">모든 게시글을 조회하고 관리하세요</p>
      </div>

      <div className="ap-panel">
        <div className="ap-toolbar">
          <div className="ap-search">
            <span className="ap-search-ico">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="제목 또는 내용으로 검색"
            />
          </div>

          <select
            className="ap-select"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            <option>전체 카테고리</option>
            <option>자유</option>
            <option>개발</option>
            <option>일상</option>
          </select>
        </div>

        <div className="ap-table">
          <div className="ap-tr ap-th ap-th-post">
            <div>게시글 정보</div>
            <div>작성자</div>
            <div>작성일</div>
            <div>통계</div>
            <div className="t-right">작업</div>
          </div>

          {rows.map((p) => (
            <div className="ap-tr ap-tr-post" key={p.id}>
              <div className="ap-postcell">
                <span className="ap-tag">{p.cat}</span>
                <div className="ap-posttitle">{p.title}</div>
                <div className="ap-postdesc">{p.desc}</div>
              </div>

              <div>{p.author}</div>
              <div>{p.date}</div>
              <div className="ap-statcell">
                <div>조회: {p.views}</div>
                <div>좋아요: {p.likes}</div>
                <div>댓글: {p.comments}</div>
              </div>

              <div className="t-right">
                <AdminRowMenu
                  items={[
                    {
                      label: "게시글 보기",
                      onClick: () => alert(`(더미) 게시글 ${p.id} 보기`),
                    },
                    {
                      label: "공지로 고정",
                      onClick: () => alert(`(더미) 게시글 ${p.id} 공지 고정`),
                    },
                    {
                      label: "게시글 삭제",
                      danger: true,
                      onClick: () => alert(`(더미) 게시글 ${p.id} 삭제`),
                    },
                  ]}
                />
              </div>
            </div>
          ))}

          <div className="ap-footnote">총 {rows.length}개의 게시글</div>

          <div className="ap-pager">
            <button className="ap-page">이전</button>
            <button className="ap-page active">1</button>
            <button className="ap-page">2</button>
            <button className="ap-page">다음</button>
          </div>
        </div>
      </div>
    </div>
  );
}
