import React, { useEffect, useState } from "react";
import "./adminPages.css";
import { adminApi } from "../utils/adminApi";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const d = await adminApi.dashboard();
        setData(d);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  if (err) return <div className="ap-wrap">에러: {err}</div>;
  if (!data) return <div className="ap-wrap">로딩중...</div>;

  return (
    <div className="ap-wrap">
      <div className="ap-head">
        <h1 className="ap-title">대시보드</h1>
        <p className="ap-sub">커뮤니티 운영 현황을 한눈에 확인하세요</p>
      </div>

      <div className="ap-grid ap-grid-3">
        <div className="ap-card">
          <div className="ap-card-title">전체 회원</div>
          <div className="ap-card-value">{data.totalMembers}</div>
        </div>

        <div className="ap-card">
          <div className="ap-card-title">전체 게시글</div>
          <div className="ap-card-value">{data.totalPosts}</div>
        </div>

        <div className="ap-card">
          <div className="ap-card-title">전체 댓글</div>
          <div className="ap-card-value">{data.totalComments}</div>
        </div>
      </div>

      <div className="ap-two">
        <div className="ap-panel">
          <div className="ap-panel-title">최근 활동</div>
          <ul className="ap-activity">
            {(data.recentActivities || []).map((x, i) => (
              <li key={i}>{x.text}</li>
            ))}
          </ul>
        </div>

        <div className="ap-panel">
          <div className="ap-panel-title">빠른 작업</div>
          <div className="ap-quick">
            <a className="ap-quick-btn" href="/app/admin/members"> 
              <div className="qt">회원 관리</div>
            </a>
            <a className="ap-quick-btn" href="/app/admin/posts">
              <div className="qt">게시글 관리</div>
            </a>
            <a className="ap-quick-btn" href="/app/admin/reports">
              <div className="qt">신고 처리</div>
            </a>
            <a className="ap-quick-btn" href="/app/admin/settings">
              <div className="qt">운영 설정</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
