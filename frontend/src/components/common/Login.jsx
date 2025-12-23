import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { loginUserState } from "../utils/authState";
import { loginAPI } from "../utils/authUtils";
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const data = await loginAPI(email, password);

      // ✅ 서버 응답 user 저장
      setLoginUser(data.user);

      // (선택) rememberMe는 지금 UI만. 진짜 자동로그인은 서버 쿠키/리프레시로 설계
      // localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

      alert("로그인 성공!");

      // ✅ SSR 페이지로 이동
      window.location.href = "/mainpage";
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
          <Link to="/find-id" className="link">
            {" "}
            {/* ✅ href → to, a → Link */}
            아이디 찾기
          </Link>
          <span className="divider">|</span>
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
