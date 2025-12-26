import React, { useEffect, useState } from "react";
import "./adminPages.css";
import { adminApi } from "../utils/adminApi";

export default function AdminDashboard() {
  // 데이터 상태 관리
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  // 페이지 로드 시 데이터 가져오기
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

  // 에러 발생 시
  if (err) return <div className="ap-wrap">에러: {err}</div>;

  // 로딩 중
  if (!data) return <div className="ap-wrap">로딩중...</div>;

  return (
    <div className="ap-wrap">
      {/* 페이지 제목 */}
      <div className="ap-head">
        <h1 className="ap-title">대시보드</h1>
        <p className="ap-sub">커뮤니티 운영 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 (3개 한 줄) */}
      <div className="ap-grid ap-grid-3">
        {/* 전체 회원 수 */}
        <div className="ap-card">
          <div className="ap-card-title">전체 회원</div>
          <div className="ap-card-value">{data.totalMembers}</div>
        </div>

        {/* 전체 게시글 수 */}
        <div className="ap-card">
          <div className="ap-card-title">전체 게시글</div>
          <div className="ap-card-value">{data.totalPosts}</div>
        </div>

        {/* 전체 댓글 수 */}
        <div className="ap-card">
          <div className="ap-card-title">전체 댓글</div>
          <div className="ap-card-value">{data.totalComments}</div>
        </div>
      </div>

      {/* 방문자 통계 카드 (2개 한 줄) */}
      <div className="ap-grid ap-grid-3" style={{ marginTop: "14px" }}>
        {/* 오늘 방문자 수 */}
        <div className="ap-card">
          <div className="ap-card-title">오늘 방문자</div>
          <div className="ap-card-value">{data.todayVisitors || 0}</div>
          <div className="ap-card-hint">IP 기준 중복 제거</div>
        </div>

        {/* 총 누적 방문자 수 */}
        <div className="ap-card">
          <div className="ap-card-title">누적 방문자</div>
          <div className="ap-card-value">{data.totalVisitors || 0}</div>
          <div className="ap-card-hint">전체 기간 IP 기준</div>
        </div>

        {/* 빈 칸 (3칸 맞추기용) */}
        <div></div>
      </div>

      {/* 최근 활동 & 빠른 작업 */}
      <div className="ap-two">
        {/* 최근 활동 */}
        <div className="ap-panel">
          <div className="ap-panel-title">최근 활동</div>
          <ul className="ap-activity">
            {(data.recentActivities || []).map((x, i) => (
              <li key={i}>{x.text}</li>
            ))}
          </ul>
        </div>

        {/* 빠른 작업 */}
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
