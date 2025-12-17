import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "아이디를 입력해주세요";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // API 호출 예시
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공
        console.log("로그인 성공:", data);
        alert("로그인 성공!");
      } else {
        // 로그인 실패
        setErrors({ general: data.message || "로그인에 실패했습니다" });
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setErrors({ general: "서버 연결에 실패했습니다" });
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* 로고 */}
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

        {/* 전체 에러 메시지 */}
        {errors.general && (
          <div className="error-message general">{errors.general}</div>
        )}

        <form onSubmit={handleLogin}>
          {/* 아이디 입력 */}
          <div className="input-group">
            <label className="input-label">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) {
                  setErrors({ ...errors, username: "" });
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="아이디를 입력하세요"
              className={`input-field ${errors.username ? "error" : ""}`}
              disabled={isLoading}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="input-group">
            <label className="input-label">비밀번호</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                onKeyPress={handleKeyPress}
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

          {/* 자동 로그인 체크박스 */}
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

          {/* 로그인 버튼 */}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="link-section">
          <a href="/find-id" className="link">
            아이디 찾기
          </a>
          <span className="divider">|</span>
          <a href="/find-password" className="link">
            비밀번호 찾기
          </a>
        </div>

        {/* 회원가입 */}
        <div className="signup-section">
          계정이 없으신가요?{" "}
          <a href="/signup" className="signup-link">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
}
