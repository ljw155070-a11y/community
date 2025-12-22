// authUtils.js
const API_BASE_URL = `${import.meta.env.VITE_BACK_SERVER}/api/member`;

// ✅ 로그인 (쿠키 저장됨: credentials: 'include')
export const loginAPI = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 쿠키 전송/수신
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "로그인 실패");
  }

  // 백엔드 응답 형태:
  // { success, message, token, user: { memberId, email, name, nickname } }
  return data;
};

// ✅ 로그아웃 (서버 쿠키 삭제 + recoil/localStorage 정리)
export const logoutAPI = async (setLoginUser) => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    setLoginUser(null);
    localStorage.removeItem("loginUser");
    window.location.href = "/login"; // ✅ App 라우팅에 맞춤
  }
};

// ✅ 현재 로그인 사용자 조회 (쿠키 기반)
export const getCurrentUserAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/me`, {
    credentials: "include",
  });

  const data = await res.json();
  return data.success ? data.user : null;
};

// ✅ 회원가입
export const registerAPI = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "회원가입 실패");
  }

  return data;
};
