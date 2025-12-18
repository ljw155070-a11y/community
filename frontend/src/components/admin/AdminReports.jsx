import React, { useMemo, useState } from "react";
import "./adminPages.css";

const mockReports = [
  {
    id: 1,
    type: "게시글",
    target: "오늘 점심 뭐 먹을까요?",
    reporter: "신고자1",
    reason: "스팸성 게시글",
    date: "2024. 12. 14.",
    status: "대기중",
  },
  {
    id: 2,
    type: "댓글",
    target: "댓글: 저도 반갑습니다!",
    reporter: "신고자2",
    reason: "욕설 및 비방",
    date: "2024. 12. 14.",
    status: "대기중",
  },
];

export default function AdminReports() {
  const [tab, setTab] = useState("전체");
  const [open, setOpen] = useState(null);

  const rows = useMemo(() => {
    if (tab === "전체") return mockReports;
    // 더미라서 탭 필터만 형태로 유지
    return mockReports.filter(() => false);
  }, [tab]);

  return (
    <div className="ap-wrap">
      <div className="ap-head">
        <h1 className="ap-title">신고 관리</h1>
        <p className="ap-sub">사용자 신고를 검토하고 처리하세요</p>
      </div>

      <div className="ap-panel">
        <div className="ap-tabs">
          {["전체", "대기중", "처리완료", "거부됨"].map((t) => (
            <button
              key={t}
              className={`ap-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t} {t === "전체" ? "(2)" : "(0)"}
            </button>
          ))}
        </div>

        <div className="ap-table">
          <div className="ap-tr ap-th ap-th-report">
            <div>신고 대상</div>
            <div>신고자</div>
            <div>신고 사유</div>
            <div>신고일</div>
            <div>상태</div>
            <div className="t-right">작업</div>
          </div>

          {rows.map((r) => (
            <div className="ap-tr ap-tr-report" key={r.id}>
              <div className="ap-reportcell">
                <span className="ap-tag">{r.type}</span>
                <div className="ap-posttitle">{r.target}</div>
              </div>
              <div>{r.reporter}</div>
              <div>{r.reason}</div>
              <div>{r.date}</div>
              <div>
                <span className="ap-pill warn">🟡 대기중</span>
              </div>
              <div className="t-right">
                <button
                  className="ap-eye"
                  onClick={() => setOpen(r)}
                  title="상세 보기"
                >
                  👁
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <ReportModal
          report={open}
          onClose={() => setOpen(null)}
          onApprove={() => alert("(더미) 신고 처리")}
          onReject={() => alert("(더미) 신고 거부")}
        />
      )}
    </div>
  );
}

function ReportModal({ report, onClose, onApprove, onReject }) {
  return (
    <div className="ap-modal-backdrop" onClick={onClose}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal-head">
          <div className="ap-modal-title">신고 상세</div>
          <button className="ap-modal-x" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ap-modal-body">
          <div className="ap-dl">
            <div className="dt">신고 대상</div>
            <div className="dd">
              <span className="ap-tag">{report.type}</span> {report.target}
            </div>

            <div className="dt">신고자</div>
            <div className="dd">{report.reporter}</div>

            <div className="dt">신고 사유</div>
            <div className="dd">{report.reason}</div>

            <div className="dt">신고일</div>
            <div className="dd">{report.date} · 오후 3:30:00</div>

            <div className="dt">상태</div>
            <div className="dd">
              <span className="ap-pill warn">🟡 대기중</span>
            </div>
          </div>

          <div className="ap-modal-actions">
            <button className="ap-btn" onClick={onReject}>
              ✕ 신고 거부
            </button>
            <button className="ap-btn primary" onClick={onApprove}>
              ✓ 신고 처리
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
