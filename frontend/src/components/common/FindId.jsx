import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FindId.css";

const FindId = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [foundEmail, setFoundEmail] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFindId = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setFoundEmail(null);

    try {
      const response = await fetch(
        `http://localhost:9999/member/find-id?name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setFoundEmail(data.email);
        setErrors({});
      } else {
        setErrors({
          general: data.message || "일치하는 회원 정보를 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      setErrors({ general: "서버 연결에 실패했습니다" });
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
          <h2 className="login-title">아이디 찾기</h2>
          <p className="login-subtitle">
            가입 시 입력한 이름과 이메일을 입력해주세요
          </p>
        </div>

        {errors.general && (
          <div className="error-message general">{errors.general}</div>
        )}

        {foundEmail && (
          <div className="success-message">
            <p>회원님의 아이디를 찾았습니다!</p>
            <div className="found-email">{foundEmail}</div>
          </div>
        )}

        <form onSubmit={handleFindId}>
          <div className="input-group">
            <label className="input-label">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="홍길동"
              className={`input-field ${errors.name ? "error" : ""}`}
              disabled={isLoading}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "검색 중..." : "아이디 찾기"}
          </button>
        </form>

        <div className="link-section">
          <Link to="/app/login" className="link">
            로그인
          </Link>
          <span className="divider">|</span>
          <Link to="/app/find-password" className="link">
            비밀번호 찾기
          </Link>
        </div>

        <div className="signup-section">
          계정이 없으신가요?{" "}
          <Link to="/app/signup" className="signup-link">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindId;
