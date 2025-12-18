import React, { useMemo, useState } from "react";
import "./about.css";

const MEMBERS = [
  {
    id: "jeonhyunwoo",
    name: "전현우",
    role: "Frontend Developer",
    email: "jeonhw@example.com",
    github: "github.com/jeonhw",
    intro: "사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    ssr: ["메인페이지 (Thymeleaf)"],
    csr: ["설정 페이지 (React)", "알림 시스템 (React)"],
    stacks: {
      frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue.js"],
      backend: ["Node.js", "Express", "Spring Boot"],
    },
    skills: {
      coding: [
        { name: "HTML", level: 5 },
        { name: "CSS", level: 5 },
        { name: "JavaScript", level: 5 },
        { name: "React", level: 5 },
        { name: "Vue.js", level: 4 },
        { name: "TypeScript", level: 4 },
      ],
      backend: [
        { name: "Node.js", level: 3 },
        { name: "Spring Boot", level: 3 },
      ],
      tools: [{ name: "Git", level: 4 }],
    },
    projects: [
      {
        title: "메인 페이지(SSR)",
        badge: "Team project",
        desc: "프로젝트 소개/성과 지표 및 팀 포트폴리오 섹션 구성",
        stack: ["Thymeleaf", "Spring MVC", "CSS"],
      },
      {
        title: "설정/알림(CSR)",
        badge: "Team project",
        desc: "상태 관리 기반 사용자 설정/알림 UI 구현",
        stack: ["React", "Recoil", "Axios"],
      },
    ],
  },

  {
    id: "leejinwon",
    name: "이진원",
    role: "Fullstack Developer",
    email: "jw155070@gmail.com",
    github: "github.com/jinwon",
    intro: "SSR/CSR 혼합 아키텍처로 생산성을 끌어올리는 개발자입니다.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    ssr: ["게시판 목록(비로그인) (Thymeleaf)"],
    csr: ["글 작성/수정/삭제(로그인 후) (React)", "회원가입 (React)"],
    stacks: {
      frontend: ["HTML", "CSS", "JavaScript", "React"],
      backend: ["Spring Boot", "MyBatis", "Oracle"],
    },
    skills: {
      coding: [
        { name: "HTML", level: 4 },
        { name: "CSS", level: 4 },
        { name: "JavaScript", level: 5 },
        { name: "React", level: 5 },
        { name: "TypeScript", level: 3 },
      ],
      backend: [
        { name: "Spring Boot", level: 4 },
        { name: "MyBatis", level: 3 },
      ],
      tools: [{ name: "Git", level: 4 }],
    },
    projects: [
      {
        title: "게시판 목록(SSR)",
        badge: "Team project",
        desc: "카테고리/검색/정렬/페이지네이션 포함 SSR 목록 구현",
        stack: ["Thymeleaf", "Spring MVC", "Oracle"],
      },
      {
        title: "게시글 CRUD(CSR)",
        badge: "Team project",
        desc: "작성/수정/삭제 CSR 전환으로 인터랙션 강화",
        stack: ["React", "JWT", "Fetch/Axios"],
      },
      {
        title: "회원가입(CSR)",
        badge: "Team project",
        desc: "유효성 검사 및 API 연동 기반 회원가입 플로우 구성",
        stack: ["React", "Recoil", "Spring Boot"],
      },
    ],
  },

  {
    id: "chaeheechan",
    name: "채희찬",
    role: "Frontend Developer & Auth Specialist",
    email: "heechan@example.com",
    github: "github.com/heechan",
    intro: "JWT 인증 흐름과 사용자 경험을 동시에 잡는 구현에 강점이 있습니다.",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=faces",
    ssr: ["공지사항 (Thymeleaf)"],
    csr: ["마이페이지(로그인 후) (React)", "일반 로그인 (React/JWT)"],
    stacks: {
      frontend: ["HTML", "CSS", "JavaScript", "React"],
      backend: ["Spring Boot", "JWT"],
    },
    skills: {
      coding: [
        { name: "HTML", level: 4 },
        { name: "CSS", level: 4 },
        { name: "JavaScript", level: 4 },
        { name: "React", level: 4 },
      ],
      backend: [
        { name: "Spring Boot", level: 3 },
        { name: "JWT", level: 4 },
      ],
      tools: [{ name: "Git", level: 4 }],
    },
    projects: [
      {
        title: "일반 로그인(JWT)",
        badge: "Team project",
        desc: "JWT 기반 로그인 및 인증 플로우 구현",
        stack: ["React", "JWT", "Spring Boot"],
      },
      {
        title: "마이페이지(CSR)",
        badge: "Team project",
        desc: "로그인 사용자 전용 페이지 및 UI 구성",
        stack: ["React", "Recoil", "Axios"],
      },
    ],
  },

  {
    id: "leeyongjae",
    name: "이용재",
    role: "Fullstack Developer & UI/UX",
    email: "yongjae@example.com",
    github: "github.com/yongjae",
    intro: "서비스 일관성을 위해 공통 레이아웃과 상세 UX를 책임집니다.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop&crop=faces",
    ssr: [
      "게시글 상세(비로그인) (Thymeleaf)",
      "이용약관/개인정보처리방침 (Thymeleaf)",
    ],
    csr: ["헤더/푸터 (React) + SSR 공통 프래그먼트 병행"],
    stacks: {
      frontend: ["HTML", "CSS", "JavaScript", "React"],
      backend: ["Spring Boot"],
    },
    skills: {
      coding: [
        { name: "HTML", level: 4 },
        { name: "CSS", level: 5 },
        { name: "JavaScript", level: 4 },
        { name: "React", level: 4 },
      ],
      backend: [{ name: "Spring Boot", level: 3 }],
      tools: [{ name: "Git", level: 4 }],
    },
    projects: [
      {
        title: "게시글 상세(SSR)",
        badge: "Team project",
        desc: "비로그인 상세 페이지 SSR 구성 및 레이아웃 정리",
        stack: ["Thymeleaf", "Spring MVC"],
      },
      {
        title: "헤더/푸터 공통화",
        badge: "Team project",
        desc: "CSR/SSR 모두에서 재사용 가능한 공통 레이아웃 정리",
        stack: ["React", "Thymeleaf Fragment", "CSS"],
      },
    ],
  },
];

function Bars({ level = 0 }) {
  return (
    <div className="bars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < level ? "bar on" : "bar"} />
      ))}
    </div>
  );
}

export default function About() {
  const [activeId, setActiveId] = useState(MEMBERS[0].id);
  const [tab, setTab] = useState("role"); // role | skills | projects

  const active = useMemo(
    () => MEMBERS.find((m) => m.id === activeId) ?? MEMBERS[0],
    [activeId]
  );

  return (
    <div className="about-wrap">
      {/* ✅ 1) 상단 프로젝트 소개(고정) */}
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

      {/* ✅ 2) 프로젝트 목적 및 성과(고정) */}
      <section className="card">
        <h2 className="card-title">프로젝트 목적 및 성과</h2>

        <div className="goal-grid">
          <div className="goal">
            <div className="goal-head">⚡ 개발 생산성 혁신</div>
            <p>
              기존 커뮤니티 개발이 4인 기준 4주 정도 소요되었으나, 바이브코딩
              방식으로 핵심 구현에 집중하여 4일 만에 완성했습니다. 이를 통해 약
              700% 생산성 향상을 체감했습니다.
            </p>
          </div>

          <div className="goal">
            <div className="goal-head">✅ 효율적인 기술 스택 활용</div>
            <p>
              공개 페이지는 SSR로 SEO/초기 로딩을 강화하고, 사용자 페이지는
              CSR로 상호작용을 극대화했습니다.
            </p>
          </div>
        </div>

        <div className="stack3">
          <div className="stackBox ssr">
            <div className="stackTitle">SSR (Thymeleaf)</div>
            <ul>
              <li>메인페이지</li>
              <li>게시판 목록/상세</li>
              <li>공지사항</li>
              <li>이용약관/개인정보처리방침</li>
              <li>헤더/푸터(공통 파일)</li>
            </ul>
          </div>

          <div className="stackBox csr">
            <div className="stackTitle">CSR (React)</div>
            <ul>
              <li>사용자 전용 페이지</li>
              <li>글 작성/수정/삭제</li>
              <li>회원가입/로그인(JWT)</li>
              <li>마이페이지/설정/알림</li>
              <li>헤더/푸터(React)</li>
            </ul>
          </div>

          <div className="stackBox auth">
            <div className="stackTitle">인증 시스템</div>
            <ul>
              <li>일반 사용자: JWT 기반</li>
              <li>관리자: 세션 기반</li>
              <li>권한 기반 접근 제어</li>
              <li>보안 강화 설계</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ✅ 3) 팀 구성원 포트폴리오(여기만 동적으로 변화) */}
      <section className="team card">
        <div className="team-head">
          <div className="team-icon">👥</div>
          <div>
            <h2 className="card-title">팀 구성원 포트폴리오</h2>
            <p className="muted">
              각 구성원의 기술 스택, 역할, 프로젝트 경험을 확인하세요
            </p>
          </div>
        </div>

        <div className="team-shell">
          {/* 좌측 멤버 리스트 */}
          <aside className="team-left">
            {MEMBERS.map((m) => (
              <button
                key={m.id}
                className={m.id === activeId ? "member active" : "member"}
                onClick={() => setActiveId(m.id)}
              >
                <img className="avatar" src={m.avatarUrl} alt={m.name} />
                <div className="meta">
                  <div className="name">{m.name}</div>
                  <div className="role">{m.role}</div>
                </div>
              </button>
            ))}
          </aside>

          {/* 우측(동적 영역) */}
          <div className="team-right">
            {/* 다크 프로필 */}
            <div className="profile">
              <img
                className="profile-avatar"
                src={active.avatarUrl}
                alt={active.name}
              />
              <div className="profile-text">
                <div className="profile-name">{active.name}</div>
                <div className="profile-intro">{active.intro}</div>
                <div className="profile-links">
                  <span>✉ {active.email}</span>
                  <span>🔗 {active.github}</span>
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div className="tabs">
              <button
                className={tab === "role" ? "tab active" : "tab"}
                onClick={() => setTab("role")}
              >
                프로젝트 역할
              </button>
              <button
                className={tab === "skills" ? "tab active" : "tab"}
                onClick={() => setTab("skills")}
              >
                기술 스택
              </button>
              <button
                className={tab === "projects" ? "tab active" : "tab"}
                onClick={() => setTab("projects")}
              >
                주요 프로젝트
              </button>
            </div>

            {/* 탭 콘텐츠(동적) */}
            <div className="tab-body">
              {tab === "role" && (
                <>
                  <p className="role-desc">
                    SSR 기반 페이지 구축과 사용자 경험을 중심으로 한 설정 및
                    알림 기능을 담당했습니다.
                  </p>

                  <div className="role-grid">
                    <div className="role-box ssr">
                      <h3>SSR 담당 영역</h3>
                      <ul>
                        {active.ssr.map((x) => (
                          <li key={x}>✓ {x}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="role-box csr">
                      <h3>CSR 담당 영역</h3>
                      <ul>
                        {active.csr.map((x) => (
                          <li key={x}>✓ {x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="stack-cards">
                    <div className="stack-card">
                      <div className="stack-card-title">{"</>"} Front-end</div>
                      <div className="chips">
                        {active.stacks.frontend.map((s) => (
                          <span className="chip" key={s}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="stack-card">
                      <div className="stack-card-title">🗄 Back-end</div>
                      <div className="chips">
                        {active.stacks.backend.map((s) => (
                          <span className="chip" key={s}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {tab === "skills" && (
                <div className="skills">
                  <h3 className="sec-title">기술 역량 평가</h3>

                  <div className="skill-section">
                    <div className="skill-head">{"</>"} Coding skills</div>
                    {active.skills.coding.map((s) => (
                      <div className="skill-row" key={s.name}>
                        <div className="skill-name">{s.name}</div>
                        <Bars level={s.level} />
                      </div>
                    ))}
                  </div>

                  <div className="skill-section">
                    <div className="skill-head">🗄 Back-end</div>
                    {active.skills.backend.map((s) => (
                      <div className="skill-row" key={s.name}>
                        <div className="skill-name">{s.name}</div>
                        <Bars level={s.level} />
                      </div>
                    ))}
                  </div>

                  <div className="skill-section">
                    <div className="skill-head">🧰 Tools</div>
                    {active.skills.tools.map((s) => (
                      <div className="skill-row" key={s.name}>
                        <div className="skill-name">{s.name}</div>
                        <Bars level={s.level} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "projects" && (
                <div className="projects">
                  <h3 className="sec-title">개발 프로젝트</h3>

                  <div className="proj-grid">
                    {active.projects.map((p) => (
                      <div className="proj-card" key={p.title}>
                        <div className="proj-img" />
                        <div className="proj-body">
                          <div className="proj-top">
                            <div className="proj-title">{p.title}</div>
                            <span className="badge">{p.badge}</span>
                          </div>
                          <p className="proj-desc">{p.desc}</p>
                          <div className="chips light">
                            {p.stack.map((x) => (
                              <span className="chip light" key={x}>
                                {x}
                              </span>
                            ))}
                          </div>
                          <a
                            className="proj-link"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            자세히 보기 →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ 4) 핵심 학습 내용(고정) */}
      <section className="learn card learn-bg">
        <h2 className="learn-title">핵심 학습 내용</h2>

        <div className="learn-grid">
          <div className="learn-box">
            <h3>하이브리드 아키텍처의 이해</h3>
            <p>
              SSR과 CSR의 장단점을 이해하고, 각 페이지 특성에 맞춰 최적의 렌더링
              방식을 선택하는 능력을 배웠습니다. SEO가 중요한 공개 페이지는 SSR,
              사용자 상호작용이 많은 페이지는 CSR로 구현해 성능과 UX를 균형있게
              구성했습니다.
            </p>
          </div>

          <div className="learn-box">
            <h3>바이브코딩의 효율성</h3>
            <p>
              AI 기반 개발(바이브코딩)을 통해 반복 구현 시간을 줄이고, 핵심
              비즈니스 로직에 집중하는 생산성 향상을 경험했습니다.
            </p>
          </div>

          <div className="learn-box">
            <h3>효율적인 역할 분담</h3>
            <p>
              각 팀원이 SSR 1개 + CSR 2개를 담당하도록 역할을 분담해 병렬 개발
              효율을 극대화했습니다. 팀원 간 코드 리뷰/합의된 UI 룰로 일관성을
              유지했습니다.
            </p>
          </div>

          <div className="learn-box">
            <h3>실전 인증 시스템 구현</h3>
            <p>
              일반 사용자는 JWT 기반 인증을 적용하고, 관리자 영역은 세션
              기반으로 분리하여 보안/운영 요구사항을 충족하는 구조를
              학습했습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
