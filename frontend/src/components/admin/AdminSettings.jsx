import React, { useState } from "react";
import "./adminPages.css";

export default function AdminSettings() {
  const [menu, setMenu] = useState("일반");
  const [siteName, setSiteName] = useState("커뮤니티");
  const [siteDesc, setSiteDesc] = useState(
    "함께 소통하고 성장하는 커뮤니티 플랫폼"
  );
  const [maintenance, setMaintenance] = useState(false);
  const [signupAllowed, setSignupAllowed] = useState(true);

  const [emailVerify, setEmailVerify] = useState(true);
  const [minPw, setMinPw] = useState(8);
  const [sessionMin, setSessionMin] = useState(30);
  const [maxTry, setMaxTry] = useState(5);

  const [emailAlarm, setEmailAlarm] = useState(true);
  const [pushAlarm, setPushAlarm] = useState(false);
  const [reportAlarm, setReportAlarm] = useState(true);
  const [newMemberAlarm, setNewMemberAlarm] = useState(false);

  return (
    <div className="ap-wrap">
      <div className="ap-head">
        <h1 className="ap-title">운영 설정</h1>
        <p className="ap-sub">커뮤니티 운영을 위한 설정을 관리하세요</p>
      </div>

      <div className="ap-settings">
        <aside className="ap-sidemenu">
          {["일반", "보안", "알림", "콘텐츠"].map((x) => (
            <button
              key={x}
              className={`ap-sidebtn ${menu === x ? "active" : ""}`}
              onClick={() => setMenu(x)}
            >
              <span className="ap-sideico">
                {x === "일반"
                  ? "🌐"
                  : x === "보안"
                  ? "🛡️"
                  : x === "알림"
                  ? "🔔"
                  : "📄"}
              </span>
              {x}
            </button>
          ))}
        </aside>

        <section className="ap-panel ap-settings-panel">
          {menu === "일반" && (
            <>
              <div className="ap-panel-head">
                <div className="ap-panel-ico">🌐</div>
                <div>
                  <div className="ap-panel-title big">일반 설정</div>
                  <div className="ap-panel-sub">
                    기본적인 사이트 설정을 관리하세요
                  </div>
                </div>
              </div>

              <div className="ap-form">
                <label className="ap-label">사이트 이름</label>
                <input
                  className="ap-input"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />

                <label className="ap-label">사이트 설명</label>
                <textarea
                  className="ap-textarea"
                  value={siteDesc}
                  onChange={(e) => setSiteDesc(e.target.value)}
                />

                <ToggleRow
                  title="유지보수 모드"
                  desc="활성화 시 관리자만 접근 가능합니다"
                  checked={maintenance}
                  onChange={setMaintenance}
                />
                <ToggleRow
                  title="회원가입 허용"
                  desc="새로운 사용자의 회원가입을 허용합니다"
                  checked={signupAllowed}
                  onChange={setSignupAllowed}
                />

                <div className="ap-actions">
                  <button className="ap-btn primary">💾 설정 저장</button>
                </div>
              </div>
            </>
          )}

          {menu === "보안" && (
            <>
              <div className="ap-panel-head">
                <div className="ap-panel-ico">🛡️</div>
                <div>
                  <div className="ap-panel-title big">보안 설정</div>
                  <div className="ap-panel-sub">
                    계정 및 보안 정책을 관리하세요
                  </div>
                </div>
              </div>

              <div className="ap-form">
                <ToggleRow
                  title="이메일 인증 필수"
                  desc="회원가입 시 이메일 인증을 요구합니다"
                  checked={emailVerify}
                  onChange={setEmailVerify}
                />

                <label className="ap-label">최소 비밀번호 길이</label>
                <input
                  className="ap-input"
                  value={minPw}
                  onChange={(e) => setMinPw(e.target.value)}
                />

                <label className="ap-label">세션 타임아웃 (분)</label>
                <input
                  className="ap-input"
                  value={sessionMin}
                  onChange={(e) => setSessionMin(e.target.value)}
                />

                <label className="ap-label">최대 로그인 시도 횟수</label>
                <input
                  className="ap-input"
                  value={maxTry}
                  onChange={(e) => setMaxTry(e.target.value)}
                />

                <div className="ap-actions">
                  <button className="ap-btn primary">💾 설정 저장</button>
                </div>
              </div>
            </>
          )}

          {menu === "알림" && (
            <>
              <div className="ap-panel-head">
                <div className="ap-panel-ico">🔔</div>
                <div>
                  <div className="ap-panel-title big">알림 설정</div>
                  <div className="ap-panel-sub">
                    시스템 알림 설정을 관리하세요
                  </div>
                </div>
              </div>

              <div className="ap-form">
                <ToggleRow
                  title="이메일 알림 활성화"
                  desc="사용자에게 이메일 알림을 전송합니다"
                  checked={emailAlarm}
                  onChange={setEmailAlarm}
                />
                <ToggleRow
                  title="푸시 알림 활성화"
                  desc="브라우저 푸시 알림을 전송합니다"
                  checked={pushAlarm}
                  onChange={setPushAlarm}
                />
                <ToggleRow
                  title="신고 알림 (관리자)"
                  desc="새로운 신고가 접수되면 관리자에게 알림"
                  checked={reportAlarm}
                  onChange={setReportAlarm}
                />
                <ToggleRow
                  title="신규 회원 알림 (관리자)"
                  desc="새로운 회원 가입 시 관리자에게 알림"
                  checked={newMemberAlarm}
                  onChange={setNewMemberAlarm}
                />

                <div className="ap-actions">
                  <button className="ap-btn primary">💾 설정 저장</button>
                </div>
              </div>
            </>
          )}

          {menu === "콘텐츠" && (
            <>
              <div className="ap-panel-head">
                <div className="ap-panel-ico">📄</div>
                <div>
                  <div className="ap-panel-title big">콘텐츠 설정</div>
                  <div className="ap-panel-sub">
                    게시글/댓글 관련 정책을 설정하세요
                  </div>
                </div>
              </div>

              <div className="ap-form">
                <label className="ap-label">금칙어(더미)</label>
                <textarea
                  className="ap-textarea"
                  defaultValue="스팸, 광고, 욕설"
                />

                <div className="ap-actions">
                  <button className="ap-btn primary">💾 설정 저장</button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="ap-toggle">
      <div>
        <div className="ap-toggle-title">{title}</div>
        <div className="ap-toggle-desc">{desc}</div>
      </div>

      <button
        type="button"
        className={`ap-switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
        aria-label={title}
      >
        <span className="ap-switch-handle" />
      </button>
    </div>
  );
}
