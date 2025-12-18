import React, { useMemo, useState } from "react";
import "./about.css";
import { members } from "./data";

export default function About() {
  const [activeMemberId, setActiveMemberId] = useState(members[0].id);
  const [tab, setTab] = useState("role"); // role | stack | projects
  const [openProject, setOpenProject] = useState(null); // project object

  const activeMember = useMemo(
    () => members.find((m) => m.id === activeMemberId),
    [activeMemberId]
  );

  const closeProject = () => setOpenProject(null);

  return (
    <div className="about-wrap">
      {/* HERO (프로젝트 목적/성과 고정) */}
      <section className="hero">
        <h1>프로젝트 소개</h1>
        <p>SSR과 CSR의 최적 조합으로 구현한 하이브리드 커뮤니티 플랫폼</p>

        <div className="hero-metrics">
          <div className="m">
            <div className="m-num">700%</div>
            <div className="m-label">생산성 향상</div>
          </div>
          <div className="m">
            <div className="m-num">4주 → 4일</div>
            <div className="m-label">개발 기간 단축</div>
          </div>
          <div className="m">
            <div className="m-num">4명</div>
            <div className="m-label">개발 인원</div>
          </div>
        </div>
      </section>

      {/* 프로젝트 목적 및 성과 (고정) */}
      <section className="card">
        <h2 className="card-title">프로젝트 목적 및 성과</h2>

        <div className="goal-grid">
          <div className="goal">
            <div className="goal-head">⚡ 개발 생산성 혁신</div>
            <p>
              기존 유사 커뮤니티는 4인 기준 약 4주 소요되었으나, 바이브코딩 기반
              협업으로 4일 내 완성하여 생산성 향상을 체감했습니다.
            </p>
          </div>
          <div className="goal">
            <div className="goal-head">✅ 효율적인 기술 스택 활용</div>
            <p>
              SSR(Thymeleaf)은 SEO/초기 로딩, CSR(React)은 동적 UX에 강점을 가져
              영역별 최적 방식을 적용했습니다.
            </p>
          </div>
        </div>

        <div className="stack3">
          <div className="stackBox ssr">
            <div className="stackTitle">SSR (Thymeleaf)</div>
            <ul>
              <li>메인페이지, 게시판 목록/상세, 공지</li>
              <li>이용약관/개인정보처리방침</li>
            </ul>
          </div>
          <div className="stackBox csr">
            <div className="stackTitle">CSR (React)</div>
            <ul>
              <li>회원가입/로그인</li>
              <li>글 작성/수정/삭제</li>
              <li>설정, 알림, 마이페이지</li>
            </ul>
          </div>
          <div className="stackBox auth">
            <div className="stackTitle">인증 시스템</div>
            <ul>
              <li>일반 사용자: JWT 기반</li>
              <li>관리자: 권한 분리</li>
              <li>정지/권한 제어</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 팀 구성원 포트폴리오 (여기만 동적으로 변함) */}
      <section className="card">
        <div className="team-head">
          <div className="team-icon">👥</div>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>
              팀 구성원 포트폴리오
            </h2>
            <p className="muted">
              각 구성원의 기술 스택, 역할, 프로젝트 경험을 확인하세요
            </p>
          </div>
        </div>

        <div className="team-shell">
          {/* LEFT */}
          <aside className="team-left">
            {members.map((m) => (
              <button
                key={m.id}
                className={`member ${m.id === activeMemberId ? "active" : ""}`}
                onClick={() => {
                  setActiveMemberId(m.id);
                  setTab("role");
                  setOpenProject(null);
                }}
              >
                <img className="avatar" src={m.avatar} alt={m.name} />
                <div className="meta">
                  <div className="name">{m.name}</div>
                  <div className="role">{m.role}</div>
                </div>
              </button>
            ))}
          </aside>

          {/* RIGHT */}
          <div className="team-right">
            <div className="profile">
              <img
                className="profile-avatar"
                src={activeMember.avatar}
                alt={activeMember.name}
              />
              <div>
                <div className="profile-name">{activeMember.name}</div>
                <div className="profile-intro">{activeMember.intro}</div>
                <div className="profile-links">
                  <span>✉ {activeMember.email}</span>
                  <span>🔗 {activeMember.github}</span>
                </div>
              </div>
            </div>

            <div className="tabs">
              <button
                className={`tab ${tab === "role" ? "active" : ""}`}
                onClick={() => setTab("role")}
              >
                프로젝트 역할
              </button>
              <button
                className={`tab ${tab === "stack" ? "active" : ""}`}
                onClick={() => setTab("stack")}
              >
                기술 스택
              </button>
              <button
                className={`tab ${tab === "projects" ? "active" : ""}`}
                onClick={() => setTab("projects")}
              >
                주요 프로젝트
              </button>
            </div>

            <div className="tab-body">
              {tab === "role" && (
                <>
                  <p className="role-desc">
                    SSR/CSR 혼합 아키텍처 내에서 담당 영역을 기준으로
                    정리했습니다.
                  </p>
                  <div className="role-grid">
                    <div className="role-box ssr">
                      <h3>✅ SSR 담당 영역</h3>
                      <ul>
                        {activeMember.roleWork.ssr.map((x, idx) => (
                          <li key={idx}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="role-box csr">
                      <h3>✅ CSR 담당 영역</h3>
                      <ul>
                        {activeMember.roleWork.csr.map((x, idx) => (
                          <li key={idx}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {tab === "stack" && (
                <>
                  <h3 className="sec-title">기술 역량 평가</h3>

                  {Object.entries(activeMember.skills).map(([sec, rows]) => (
                    <div className="skill-section" key={sec}>
                      <div className="skill-head">
                        {sec === "coding"
                          ? "⌘ Coding skills"
                          : sec === "backend"
                          ? "🗄 Back-end"
                          : "🛠 Tools"}
                      </div>

                      {rows.map(([name, level]) => (
                        <div className="skill-row" key={name}>
                          <div className="skill-name">{name}</div>
                          <div className="bars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`bar ${i < level ? "on" : ""}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}

              {tab === "projects" && (
                <>
                  <h3 className="sec-title">개발 프로젝트</h3>
                  <div className="proj-grid">
                    {activeMember.projects.map((p) => (
                      <div
                        className="proj-card clickable"
                        key={p.key}
                        role="button"
                        tabIndex={0}
                        onClick={() => setOpenProject(p)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setOpenProject(p);
                        }}
                      >
                        <div className="proj-img" />

                        <div className="proj-body">
                          <div className="proj-top">
                            <div className="proj-title">{p.title}</div>
                            <span className="badge">{p.badge}</span>
                          </div>

                          <p className="proj-desc">{p.desc}</p>

                          <div className="chips light">
                            {p.stacks.map((s) => (
                              <span className="chip" key={s}>
                                {s}
                              </span>
                            ))}
                          </div>

                          {/* 👉 텍스트는 안내용으로만 */}
                          <div className="proj-link">자세히 보기 →</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ✅ 프로젝트 상세: 라우팅 이동 X, 같은 페이지에서 모달처럼 */}
        {openProject && (
          <ProjectModal project={openProject} onClose={closeProject} />
        )}
      </section>

      {/* 핵심 학습 내용 (고정) */}
      <section className="card learn-bg">
        <h2 className="learn-title">핵심 학습 내용</h2>
        <div className="learn-grid">
          <div className="learn-box">
            <h3>하이브리드 아키텍처 이해</h3>
            <p>
              SEO가 중요한 공개 페이지는 SSR, 사용자 상호작용 중심 기능은 CSR로
              분리하여 장점을 극대화했습니다.
            </p>
          </div>
          <div className="learn-box">
            <h3>바이브코딩의 효율성</h3>
            <p>
              반복 코딩 시간을 줄이고, 핵심 비즈니스 로직과 UX에 집중하여 개발
              기간을 획기적으로 단축했습니다.
            </p>
          </div>
          <div className="learn-box">
            <h3>효율적인 역할 분담</h3>
            <p>
              SSR 1개 + CSR 2개 구조로 역할을 쪼개 충돌을 줄이고, 리뷰/통합을
              빠르게 진행했습니다.
            </p>
          </div>
          <div className="learn-box">
            <h3>실전 인증 시스템 구현</h3>
            <p>
              JWT 기반 인증과 권한 분리(일반/관리자), 정지/권한 제어 등 운영
              관점의 기능을 구현했습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <div className="pm-backdrop" onClick={onClose}>
      <div className="pm" onClick={(e) => e.stopPropagation()}>
        <div className="pm-head">
          <div>
            <div className="pm-title">{project.detail.title}</div>
            <div className="pm-sub">{project.detail.summary}</div>
          </div>
          <button className="pm-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="pm-chips">
          {project.stacks.map((s) => (
            <span className="pm-chip" key={s}>
              {s}
            </span>
          ))}
        </div>

        <div className="pm-section">
          <h4>내 담당</h4>
          <ul>
            {project.myPart.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>

        {project.detail.sections.map((sec, i) => (
          <div className="pm-section" key={i}>
            <h4>{sec.h}</h4>
            <p>{sec.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
