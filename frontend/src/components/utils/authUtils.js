// authUtils.js
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_BACK_SERVER}/api/member`;

// ✅ (추가) 토큰 저장 키 (이름만 추가, 기존 함수명 변경 없음)
const ACCESS_TOKEN_KEY = "accessToken";

// ✅ (추가) 토큰 저장/조회
const saveAccessToken = (token) => {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
};
const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

// ✅ (추가) Authorization 헤더 만들기
const withAuthHeader = (headers = {}) => {
  const token = getAccessToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

/**
 * 401 에러 체크 함수
 *
 * ⭐ [중복 로그인] 다른 기기에서 로그인 시 자동 로그아웃 처리
 *
 * 동작 방식:
 * 1. API 응답이 401이면 (인증 실패)
 * 2. localStorage와 sessionStorage 확인
 * 3. 로그인 정보가 있으면 = 다른 기기에서 로그인함
 * 4. 알림 표시 + localStorage 삭제
 * 5. sessionStorage에 플래그 저장 (알림 중복 방지)
 */
const checkAuthError = async (response) => {
  if (response.status === 401) {
    const hasToken = getAccessToken();
    const hasLoginUser =
      localStorage.getItem("loginUser") || sessionStorage.getItem("loginUser"); // ⭐ sessionStorage도 확인
    const alreadyShown = sessionStorage.getItem("logoutAlertShown");

    // ⭐ 양쪽 모두 삭제
    clearAccessToken();
    localStorage.removeItem("loginUser");
    sessionStorage.removeItem("loginUser");

    const shouldShowAlert = (hasToken || hasLoginUser) && !alreadyShown;

    if (shouldShowAlert) {
      sessionStorage.setItem("logoutAlertShown", "true");

      Swal.fire({
        icon: "warning",
        title: "로그아웃되었습니다",
        text: "다른 기기에서 로그인하여 자동 로그아웃되었습니다.",
        confirmButtonText: "확인",
        allowOutsideClick: false,
      }).then(() => {
        window.location.href = "/mainpage";
      });
    }

    throw new Error("Unauthorized");
  }
  return response;
};
/**
 * ✅ 로그인 (쿠키 저장됨 + 토큰도 저장)
 *
 * ⭐ [중복 로그인] 로그인 성공 시 알림 플래그 제거
 * - 새로 로그인했으니 알림 플래그 삭제
 * - 다음에 다른 기기에서 로그인하면 다시 알림 표시 가능
 */
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

  // ✅ (추가) 응답 token을 로컬에도 저장 -> 쿠키 막혀도 CSR 인증 유지
  if (data.token) saveAccessToken(data.token);

  // ⭐ [중복 로그인] 로그인 성공하면 알림 플래그 제거
  // - 로그인 성공 = 정상적인 로그인
  // - 기존 알림 플래그 삭제해서 다음 중복 로그인 시 알림 표시 가능하게 함
  sessionStorage.removeItem("logoutAlertShown");

  // { success, message, token, user: { memberId, email, name, nickname } }
  return data;
};

// ✅ 로그아웃 (서버 쿠키 삭제 + recoil/localStorage 정리)
export const logoutAPI = async (setLoginUser) => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: withAuthHeader(),
    });
  } finally {
    clearAccessToken();
    setLoginUser(null);

    // ⭐ 양쪽 저장소 모두 삭제
    localStorage.removeItem("loginUser");
    sessionStorage.removeItem("loginUser");

    window.location.href = "/mainpage";
  }
};

/**
 * ✅ 현재 로그인 사용자 조회 (1차: 쿠키 / 2차: Bearer fallback)
 *
 * ⭐ [중복 로그인] checkAuthError 호출
 * - 401 에러 나면 자동 로그아웃 알림
 */
export const getCurrentUserAPI = async () => {
  // 1) 쿠키 기반
  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      credentials: "include",
    });

    // ⭐ [중복 로그인] 401 에러 체크
    // - DB에 토큰 없으면 401 반환됨
    // - checkAuthError에서 알림 표시
    await checkAuthError(res);

    // 쿠키로 성공하면 그대로 반환
    if (res.ok) {
      const data = await res.json();
      return data.success ? data.user : null;
    }
  } catch (e) {
    if (e.message === "Unauthorized") throw e;
    // ignore other errors
  }

  // 2) Bearer 기반 fallback
  const token = getAccessToken();
  if (!token) return null;

  try {
    const res2 = await fetch(`${API_BASE_URL}/me`, {
      credentials: "include",
      headers: withAuthHeader(),
    });

    // ⭐ [중복 로그인] 401 에러 체크
    await checkAuthError(res2);

    if (!res2.ok) return null;
    const data2 = await res2.json();
    return data2.success ? data2.user : null;
  } catch (e) {
    if (e.message === "Unauthorized") throw e;
    return null;
  }
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
