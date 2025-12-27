import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FindPassword.css";

const FindPassword = () => {
  const [step, setStep] = useState(1); // 1: 인증, 2: 비밀번호 재설정
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "비밀번호는 최소 6자 이상이어야 합니다";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "비밀번호를 다시 입력해주세요";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:9999/member/verify-account?email=${encodeURIComponent(
          email
        )}&name=${encodeURIComponent(name)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStep(2);
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:9999/member/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert("비밀번호가 성공적으로 변경되었습니다!");
        window.location.href = "/app/login";
      } else {
        setErrors({
          general: data.message || "비밀번호 재설정에 실패했습니다.",
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
          <h2 className="login-title">비밀번호 찾기</h2>
          <p className="login-subtitle">
            {step === 1
              ? "가입 시 입력한 정보를 입력해주세요"
              : "새로운 비밀번호를 설정해주세요"}
          </p>
        </div>

        {errors.general && (
          <div className="error-message general">{errors.general}</div>
        )}

        {step === 1 ? (
          <form onSubmit={handleVerify}>
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

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "확인 중..." : "계정 확인"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="input-group">
              <label className="input-label">새 비밀번호</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword)
                      setErrors({ ...errors, newPassword: "" });
                  }}
                  placeholder="새 비밀번호 (최소 6자)"
                  className={`input-field ${errors.newPassword ? "error" : ""}`}
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
              {errors.newPassword && (
                <span className="error-message">{errors.newPassword}</span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">비밀번호 확인</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                  placeholder="비밀번호 재입력"
                  className={`input-field ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </button>
          </form>
        )}

        <div className="link-section">
          <Link to="/app/login" className="link">
            로그인
          </Link>
          <span className="divider">|</span>
          <Link to="/app/find-id" className="link">
            아이디 찾기
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

export default FindPassword;
