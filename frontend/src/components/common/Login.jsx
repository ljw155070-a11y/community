import { useState } from "react";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("로그인:", { username, password });
    // 여기에 로그인 로직 추가
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

        {/* 입력 필드 */}
        <div className="input-group">
          <label className="input-label">아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label className="input-label">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="input-field"
          />
        </div>

        {/* 로그인 버튼 */}
        <button onClick={handleLogin} className="login-button">
          로그인
        </button>

        {/* 하단 링크 */}
        <div className="link-section">
          <a href="#" className="link">
            아이디 찾기
          </a>
          <span className="divider">|</span>
          <a href="#" className="link">
            비밀번호 찾기
          </a>
        </div>

        {/* 회원가입 */}
        <div className="signup-section">
          계정이 없으신가요?{" "}
          <a href="#" className="signup-link">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
