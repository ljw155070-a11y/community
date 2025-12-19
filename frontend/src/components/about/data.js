export const members = [
  {
    id: "lee",
    name: "이진원",
    role: "Fullstack Developer",
    intro: "SSR/CSR 혼합 아키텍처에서 게시판과 관리자 기능을 구현했습니다.",
    email: "jwlee@example.com",
    github: "github.com/yourid",
    avatar: "/img/people/jw.png",
    roleWork: {
      ssr: ["게시판 목록(Thymeleaf)", "검색/정렬/페이지네이션(SSR)"],
      csr: ["글 작성/수정/삭제(React)", "회원가입(React)"],
    },
    skills: {
      coding: [
        ["HTML", 5],
        ["CSS", 4],
        ["JavaScript", 4],
        ["React", 4],
        ["TypeScript", 3],
      ],
      backend: [
        ["Spring Boot", 4],
        ["Oracle", 3],
      ],
      tools: [["Git", 4]],
    },
    projects: [
      {
        key: "recipehub",
        title: "레시피 허브",
        badge: "SSR",
        desc: "Thymeleaf 기반 SSR 프로젝트. 게시판 기능을 담당했습니다.",
        stacks: ["Spring MVC", "Thymeleaf", "Oracle"],
        myPart: [
          "게시판 CRUD",
          "검색/정렬",
          "페이지네이션",
          "권한별 노출 처리",
        ],
        detail: {
          title: "레시피 허브 - 상세",
          summary:
            "Thymeleaf 기반 SSR로 구성된 레시피 공유 서비스이며, 게시판 영역을 설계/구현했습니다.",
          sections: [
            {
              h: "내 담당",
              p: "게시판 CRUD, 검색/정렬, 페이지네이션, 권한별 UI 제어",
            },
            {
              h: "기술 포인트",
              p: "SSR에서 쿼리스트링 기반 상태 유지(카테고리/검색/정렬), 목록 UX 최적화",
            },
            {
              h: "배운 점",
              p: "SSR에서 사용자 경험을 유지하려면 URL 설계와 렌더링 단위를 신중히 나눠야 함",
            },
          ],
        },
      },
      {
        key: "talkdeal",
        title: "Talk & Deal",
        badge: "CSR",
        desc: "React 기반 CSR 프로젝트. 관리자 페이지(통계/CRUD/회원관리)를 담당했습니다.",
        stacks: ["React", "Recoil", "Spring Boot", "JWT"],
        myPart: [
          "관리자 대시보드(통계)",
          "공지사항/카테고리 CRUD",
          "회원 관리(정지/해제 등)",
        ],
        detail: {
          title: "Talk & Deal - 관리자 상세",
          summary:
            "CSR(SPA) 구조로 관리자 기능을 분리하고, 데이터 조회/필터링/CRUD를 중심으로 구현했습니다.",
          sections: [
            {
              h: "내 담당",
              p: "통계 대시보드, 공지/카테고리 CRUD, 회원 정지/권한 관리",
            },
            {
              h: "기술 포인트",
              p: "JWT 인증 기반 접근 제어, 상태 관리(Recoil), 리스트/폼 공통 컴포넌트화",
            },
            {
              h: "배운 점",
              p: "관리자 기능은 UX(검색/필터/페이지네이션)와 데이터 정합성이 핵심",
            },
          ],
        },
      },
    ],
  },
  {
    id: "chae",
    name: "채희찬",
    role: "Fullstack Developer",
    intro: "SSR/CSR 혼합 아키텍처에서 게시판과 관리자 기능을 구현했습니다.",
    email: "jwlee@example.com",
    github: "github.com/yourid",
    avatar: "/img/people/jw.png",
    roleWork: {
      ssr: ["게시판 목록(Thymeleaf)", "검색/정렬/페이지네이션(SSR)"],
      csr: ["글 작성/수정/삭제(React)", "회원가입(React)"],
    },
    skills: {
      coding: [
        ["HTML", 5],
        ["CSS", 4],
        ["JavaScript", 4],
        ["React", 4],
        ["TypeScript", 3],
      ],
      backend: [
        ["Spring Boot", 4],
        ["Oracle", 3],
      ],
      tools: [["Git", 4]],
    },
    projects: [
      {
        key: "recipehub",
        title: "레시피 허브",
        badge: "SSR",
        desc: "Thymeleaf 기반 SSR 프로젝트. 게시판 기능을 담당했습니다.",
        stacks: ["Spring MVC", "Thymeleaf", "Oracle"],
        myPart: [
          "게시판 CRUD",
          "검색/정렬",
          "페이지네이션",
          "권한별 노출 처리",
        ],
        detail: {
          title: "레시피 허브 - 상세",
          summary:
            "Thymeleaf 기반 SSR로 구성된 레시피 공유 서비스이며, 게시판 영역을 설계/구현했습니다.",
          sections: [
            {
              h: "내 담당",
              p: "게시판 CRUD, 검색/정렬, 페이지네이션, 권한별 UI 제어",
            },
            {
              h: "기술 포인트",
              p: "SSR에서 쿼리스트링 기반 상태 유지(카테고리/검색/정렬), 목록 UX 최적화",
            },
            {
              h: "배운 점",
              p: "SSR에서 사용자 경험을 유지하려면 URL 설계와 렌더링 단위를 신중히 나눠야 함",
            },
          ],
        },
      },
      {
        key: "talkdeal",
        title: "Talk & Deal",
        badge: "CSR",
        desc: "React 기반 CSR 프로젝트. 관리자 페이지(통계/CRUD/회원관리)를 담당했습니다.",
        stacks: ["React", "Recoil", "Spring Boot", "JWT"],
        myPart: [
          "관리자 대시보드(통계)",
          "공지사항/카테고리 CRUD",
          "회원 관리(정지/해제 등)",
        ],
        detail: {
          title: "Talk & Deal - 관리자 상세",
          summary:
            "CSR(SPA) 구조로 관리자 기능을 분리하고, 데이터 조회/필터링/CRUD를 중심으로 구현했습니다.",
          sections: [
            {
              h: "내 담당",
              p: "통계 대시보드, 공지/카테고리 CRUD, 회원 정지/권한 관리",
            },
            {
              h: "기술 포인트",
              p: "JWT 인증 기반 접근 제어, 상태 관리(Recoil), 리스트/폼 공통 컴포넌트화",
            },
            {
              h: "배운 점",
              p: "관리자 기능은 UX(검색/필터/페이지네이션)와 데이터 정합성이 핵심",
            },
          ],
        },
      },
    ],
  },
  {
    id: "Jeon",
    name: "전현우",
    role: "Fullstack Developer",
    intro: "SSR/CSR 혼합 아키텍처에서 게시판과 관리자 기능을 구현했습니다.",
    email: "jwlee@example.com",
    github: "github.com/yourid",
    avatar: "/img/people/jw.png",
    roleWork: {
      ssr: ["게시판 목록(Thymeleaf)", "검색/정렬/페이지네이션(SSR)"],
      csr: ["글 작성/수정/삭제(React)", "회원가입(React)"],
    },
    skills: {
      coding: [
        ["HTML", 5],
        ["CSS", 4],
        ["JavaScript", 4],
        ["React", 4],
        ["TypeScript", 3],
      ],
      backend: [
        ["Spring Boot", 4],
        ["Oracle", 3],
      ],
      tools: [["Git", 4]],
    },
    projects: [
      {
        key: "recipehub",
        title: "레시피 허브",
        badge: "SSR",
        desc: "Thymeleaf 기반 SSR 프로젝트. 게시판 기능을 담당했습니다.",
        stacks: ["Spring MVC", "Thymeleaf", "Oracle"],
        myPart: [
          "게시판 CRUD",
          "검색/정렬",
          "페이지네이션",
          "권한별 노출 처리",
        ],
        detail: {
          title: "레시피 허브 - 상세",
          summary:
            "Thymeleaf 기반 SSR로 구성된 레시피 공유 서비스이며, 게시판 영역을 설계/구현했습니다.",
          sections: [
            {
              h: "내 담당",
              p: "게시판 CRUD, 검색/정렬, 페이지네이션, 권한별 UI 제어",
            },
            {
              h: "기술 포인트",
              p: "SSR에서 쿼리스트링 기반 상태 유지(카테고리/검색/정렬), 목록 UX 최적화",
            },
            {
              h: "배운 점",
              p: "SSR에서 사용자 경험을 유지하려면 URL 설계와 렌더링 단위를 신중히 나눠야 함",
            },
          ],
        },
      },
      {
        key: "talkdeal",
        title: "Talk & Deal",
        badge: "CSR",
        desc: "React 기반 CSR 프로젝트. 관리자 페이지(통계/CRUD/회원관리)를 담당했습니다.",
        stacks: ["React", "Recoil", "Spring Boot", "JWT"],
        myPart: [
          "관리자 대시보드(통계)",
          "공지사항/카테고리 CRUD",
          "회원 관리(정지/해제 등)",
        ],
        detail: {
          title: "Talk & Deal - 관리자 상세",
          summary:
            "CSR(SPA) 구조로 관리자 기능을 분리하고, 데이터 조회/필터링/CRUD를 중심으로 구현했습니다.",
          sections: [
            {
              h: "내 담당",
              p: "통계 대시보드, 공지/카테고리 CRUD, 회원 정지/권한 관리",
            },
            {
              h: "기술 포인트",
              p: "JWT 인증 기반 접근 제어, 상태 관리(Recoil), 리스트/폼 공통 컴포넌트화",
            },
            {
              h: "배운 점",
              p: "관리자 기능은 UX(검색/필터/페이지네이션)와 데이터 정합성이 핵심",
            },
          ],
        },
      },
    ],
  },
  {
    id: "LeeDragon",
    name: "이용재",
    role: "Fullstack Developer",
    intro: "SSR/CSR 혼합 아키텍처에서 게시판과 관리자 기능을 구현했습니다.",
    email: "jwlee@example.com",
    github: "github.com/yourid",
    avatar: "/img/people/jw.png",
    roleWork: {
      ssr: ["게시판 목록(Thymeleaf)", "검색/정렬/페이지네이션(SSR)"],
      csr: ["글 작성/수정/삭제(React)", "회원가입(React)"],
    },
    skills: {
      coding: [
        ["HTML", 5],
        ["CSS", 4],
        ["JavaScript", 4],
        ["React", 4],
        ["TypeScript", 3],
      ],
      backend: [
        ["Spring Boot", 4],
        ["Oracle", 3],
      ],
      tools: [["Git", 4]],
    },
    projects: [
      {
        key: "recipehub",
        title: "레시피 허브",
        badge: "SSR",
        desc: "Thymeleaf 기반 SSR 프로젝트. 게시판 기능을 담당했습니다.",
        stacks: ["Spring MVC", "Thymeleaf", "Oracle"],
        myPart: [
          "게시판 CRUD",
          "검색/정렬",
          "페이지네이션",
          "권한별 노출 처리",
        ],
        detail: {
          title: "레시피 허브 - 상세",
          summary:
            "Thymeleaf 기반 SSR로 구성된 레시피 공유 서비스이며, 게시판 영역을 설계/구현했습니다.",
          sections: [
            {
              h: "내 담당",
              p: "게시판 CRUD, 검색/정렬, 페이지네이션, 권한별 UI 제어",
            },
            {
              h: "기술 포인트",
              p: "SSR에서 쿼리스트링 기반 상태 유지(카테고리/검색/정렬), 목록 UX 최적화",
            },
            {
              h: "배운 점",
              p: "SSR에서 사용자 경험을 유지하려면 URL 설계와 렌더링 단위를 신중히 나눠야 함",
            },
          ],
        },
      },
      {
        key: "talkdeal",
        title: "Talk & Deal",
        badge: "CSR",
        desc: "React 기반 CSR 프로젝트. 관리자 페이지(통계/CRUD/회원관리)를 담당했습니다.",
        stacks: ["React", "Recoil", "Spring Boot", "JWT"],
        myPart: [
          "관리자 대시보드(통계)",
          "공지사항/카테고리 CRUD",
          "회원 관리(정지/해제 등)",
        ],
        detail: {
          title: "Talk & Deal - 관리자 상세",
          summary:
            "CSR(SPA) 구조로 관리자 기능을 분리하고, 데이터 조회/필터링/CRUD를 중심으로 구현했습니다.",
          sections: [
            {
              h: "내 담당",
              p: "통계 대시보드, 공지/카테고리 CRUD, 회원 정지/권한 관리",
            },
            {
              h: "기술 포인트",
              p: "JWT 인증 기반 접근 제어, 상태 관리(Recoil), 리스트/폼 공통 컴포넌트화",
            },
            {
              h: "배운 점",
              p: "관리자 기능은 UX(검색/필터/페이지네이션)와 데이터 정합성이 핵심",
            },
          ],
        },
      },
    ],
  },
  // 다른 팀원도 같은 구조로 추가하면 됨 (전현우/채희찬/이용재)
];
