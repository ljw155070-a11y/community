import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { loginUserState } from "../utils/authState";
import { loginAPI } from "../utils/authUtils";
import Swal from "sweetalert2"; // 중복 로그인 알림을 위해 추가
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // (프론트 표시용 유지)
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const setLoginUser = useSetRecoilState(loginUserState);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * ⭐ [중복 로그인] 로그인 성공 시 스윗얼럿으로 메시지 표시
   *
   * 서버에서 받은 message:
   * "로그인 성공. 다른 기기에서 로그인한 경우 해당 기기는 자동 로그아웃됩니다."
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const data = await loginAPI(email, password);

      // ✅ Recoil state 저장
      setLoginUser(data.user);

      // ⭐ 자동 로그인 체크 여부에 따라 저장 위치 분리
      if (rememberMe) {
        // 자동 로그인 O → localStorage (영구 보관)
        localStorage.setItem("loginUser", JSON.stringify(data.user));
        sessionStorage.removeItem("loginUser"); // 혹시 모를 중복 제거
      } else {
        // 자동 로그인 X → sessionStorage (브라우저 닫으면 삭제)
        sessionStorage.setItem("loginUser", JSON.stringify(data.user));
        localStorage.removeItem("loginUser"); // 기존 자동 로그인 정보 삭제
      }

      Swal.fire({
        icon: "success",
        title: "로그인 성공",
        text: data.message,
        confirmButtonText: "확인",
      }).then(() => {
        window.location.href = "/mainpage";
      });
    } catch (error) {
      setErrors({ general: error?.message || "서버 연결에 실패했습니다" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <div className="logo-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
                fill="white"
              />
            </svg>
          </div>
          <h2 className="login-title">로그인</h2>
          <p className="login-subtitle">계정에 로그인하여 시작하세요</p>
        </div>

        {errors.general && (
          <div className="error-message general">{errors.general}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="example@email.com"
              className={`input-field ${errors.email ? "error" : ""}`}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">비밀번호</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                placeholder="비밀번호를 입력하세요"
                className={`input-field ${errors.password ? "error" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>자동 로그인</span>
            </label>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="link-section">
          <Link to="/find-password" className="link">
            {" "}
            {/* ✅ href → to, a → Link */}
            비밀번호 찾기
          </Link>
        </div>

        <div className="signup-section">
          계정이 없으신가요? {/* ✅ 라우팅 통일: /signup */}
          <Link to="/signup" className="signup-link">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
